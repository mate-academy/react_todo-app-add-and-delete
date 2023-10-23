import React, { useState } from 'react';
import { TodoHeaderProps } from '../types/TodoHeader';

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  filteredTodos,
  toggleAllTodos,
  handleNewTodoSubmit,
  inputRef,
  isInputDisabled,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${filteredTodos.every((todo) => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={toggleAllTodos}
        />
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          return handleNewTodoSubmit(newTodoTitle, setNewTodoTitle);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={isInputDisabled}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
