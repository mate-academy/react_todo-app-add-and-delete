/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  inputRef,
  onSubmit,
  value,
  onChange,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
