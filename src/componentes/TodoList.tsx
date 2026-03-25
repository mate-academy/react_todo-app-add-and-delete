import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';

export const TodoList: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    return null;
  }

  const {
    filteredTodo,
    handleSelected,
    handleRemove,
    processingTodoIds,
    tempTodo,
  } = context;

  const renderTodo = (
    currentTodo: (typeof filteredTodo)[number],
    isTempTodo = false,
  ) => (
    <div
      key={currentTodo.id === 0 ? `temp-${currentTodo.title}` : currentTodo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: currentTodo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-${currentTodo.id}`}>
        <input
          id={`todo-${currentTodo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={currentTodo.completed}
          aria-label="Mark todo as completed"
          onChange={() => handleSelected(currentTodo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {currentTodo.title}
      </span>
      <button
        onClick={() => handleRemove(currentTodo.id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isTempTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTempTodo || processingTodoIds.includes(currentTodo.id),
        })}
      >
        <div className="loader" />
      </div>
    </div>
  );

  return (
    <>
      {filteredTodo
        .filter(currentTodo => currentTodo.title.length > 0)
        .map(currentTodo => renderTodo(currentTodo))}
      {tempTodo && renderTodo(tempTodo, true)}
    </>
  );
};
