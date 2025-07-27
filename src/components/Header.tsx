import React, { useEffect } from 'react';

type Props = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  isCreating,
  inputRef,
}) => {
  useEffect(() => {
    if (!isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isCreating]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
