import React, { useEffect, useRef } from 'react';
import { useTodos } from '../../Store';

export const Header: React.FC = () => {
  const {
    todos,
    todoTitle,
    handleSubmit,
    tempTodo,
    handleChange,
    isSubmitting,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement>(null);
  // const areAllTodosCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={tempTodo ? tempTodo.title : todoTitle}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        {isSubmitting && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div
              className="
              modal-background
              has-background-white-ter
              is-active
            "
            />
            <div className="loader" />
          </div>
        )}
      </form>
    </header>
  );
};
