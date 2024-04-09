/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef } from 'react';
import { TodosContext } from '../../TodosContext/TodosContext';

export const Header: React.FC = () => {
  const {
    isSubmiting,
    handleSetAllAsComplited,
    handlerFormSubmit,
    newTodoTitle,
    setNewTodoTitle,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [isSubmiting]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleSetAllAsComplited}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handlerFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
