/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  activeTodosCount: number;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputDisabled: boolean;
}

export const Header: React.FC<Props> = ({
  activeTodosCount,
  onInputChange,
  inputValue,
  onSubmit,
  inputDisabled,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: activeTodosCount > 0,
      })}
    />

    {/* Add a todo on form submit */}
    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={onInputChange}
        disabled={inputDisabled}
      />
    </form>
  </header>
);
