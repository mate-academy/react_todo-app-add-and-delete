import { useEffect, useRef, useState } from 'react';
import React from 'react';

type Props = {
  hasTodos: boolean;
  onAdd: (title: string) => Promise<void>;
  isSubmitting: boolean;
  loadingTodoIds: number[];
};

export const Header: React.FC<Props> = ({
    hasTodos,
    onAdd,
    isSubmitting,
    loadingTodoIds = [],
  }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, loadingTodoIds.length]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onAdd(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
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
