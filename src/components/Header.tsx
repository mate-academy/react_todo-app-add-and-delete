import React from 'react';
import { useEffect } from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
  allCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isAdding,
  allCompleted,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
          placeholder="What needs to be done?"
          className="todoapp__new-todo"
          data-cy="NewTodoField"
        />
      </form>
    </header>
  );
};
