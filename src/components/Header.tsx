import React, { useEffect } from 'react';

type HeaderProps = {
  hasTodos: boolean;
  allCompleted: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header = ({
  hasTodos,
  allCompleted,
  title,
  setTitle,
  handleSubmit,
  isAdding,
  inputRef,
}: HeaderProps) => {
  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [inputRef, isAdding]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={
            allCompleted ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'
          }
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
