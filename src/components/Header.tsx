import React from 'react';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todosLength,
  allCompleted,
  inputValue,
  onInputChange,
  onSubmit,
  isInputDisabled,
  inputRef,
}) => (
  <header className="todoapp__header">
    {todosLength > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  </header>
);