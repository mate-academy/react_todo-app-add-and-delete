import React, { useEffect, useRef } from 'react';
import { useTodos } from '../Context';

export const TodoHeader: React.FC = () => {
  const {
    handleInputChange,
    handleCreateTodo,
    newTodo,
    disableInput,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disableInput]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="btn"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleCreateTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
