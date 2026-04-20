import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    todoTitle,
    handleTitleChange,
    handleSubmitNewTodo,
    handleToggleAll,
    inputRef,
    loadingIds,
  } = useContext(TodoContext);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        onClick={() => handleToggleAll(todos)}
        className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmitNewTodo}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          value={todoTitle}
          onChange={handleTitleChange}
          className="todoapp__new-todo"
          disabled={loadingIds.length > 0}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
