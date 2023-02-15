import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  onHandleInput: React.ChangeEventHandler<HTMLInputElement>,
  onHandleSubmit: React.FormEventHandler<HTMLFormElement>;
  inputValue: string;
  isDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onHandleInput,
  onHandleSubmit,
  inputValue,
  isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle_button"
        id="toggle_button"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onHandleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={inputValue}
          disabled={isDisabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onHandleInput}
        />
      </form>
    </header>
  );
};
