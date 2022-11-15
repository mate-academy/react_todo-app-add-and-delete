/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent } from 'react';

type Props = {
  inputValue: string;
  newTodoField: React.RefObject<HTMLInputElement>;
  isExist: boolean;
  inputDisabled: boolean;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAddTodo: (event: ChangeEvent<HTMLFormElement>) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  inputValue,
  newTodoField,
  isExist,
  inputDisabled,
  handleInputChange,
  handleAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      {isExist && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={inputValue}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
