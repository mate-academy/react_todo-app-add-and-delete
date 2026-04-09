// components/Header.tsx
import React, { useEffect, useRef } from 'react';

type HeaderProps = {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAdd: (title: string) => void;
  onToggleAll: () => void;
  allCompleted: boolean;
  error: string | null;
  loading: number[];
};

export const Header: React.FC<HeaderProps> = ({
  newTitle,
  setNewTitle,
  onAdd,
  onToggleAll,
  allCompleted,
  error,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTitle, error, loading]);

  const isFormDisabled = loading.includes(0);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          onAdd(newTitle);
        }}
      >
        <input
          disabled={isFormDisabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
