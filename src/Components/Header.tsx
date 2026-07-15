import React, { useEffect } from 'react';

interface Props {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  isSubmitting,
  inputRef,
}) => {
  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
