import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, tempTodo, removeTodo, loadingTodosIds } = useTodos();
  const { id, title, completed } = todo;

  if (tempTodo) {
    loadingTodosIds.push(tempTodo.id);
  }

  const isActive = loadingTodosIds.includes(id);

  const handleCompleteTodo = (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(prevTodo =>
        prevTodo.id === todoId
          ? { ...prevTodo, completed: !completed }
          : prevTodo,
      ),
    );
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" aria-label="Todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleteTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title.trim()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
