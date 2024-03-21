import React from 'react';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  titleField: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  loading,
  onSubmit,
  titleField,
}) => {
  const inputValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={titleField}
          value={inputValue}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={inputValueHandler}
        />
      </form>
    </header>
  );
};
