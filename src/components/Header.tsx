import React, { useEffect, useRef } from 'react';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  todosCount: number;
  isInputDisabled: boolean;
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  onSubmit,
  todosCount,
  isInputDisabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, todosCount]);

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
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
          onChange={event => setInputValue(event.target.value)}
          autoFocus
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
