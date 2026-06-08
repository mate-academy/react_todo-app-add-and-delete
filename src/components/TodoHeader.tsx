import React, { useEffect } from 'react';

interface Props {
  title: string;
  setTitle: (val: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  disabled,
  inputRef,
}) => {
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, inputRef]);

  return (
    <header className="todoapp__header">
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
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={disabled}
          autoFocus
        />
      </form>
    </header>
  );
};
