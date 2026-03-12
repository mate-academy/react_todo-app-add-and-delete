import * as React from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (s: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  allCompleted: boolean;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  allCompleted,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          allCompleted ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'
        }
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};
