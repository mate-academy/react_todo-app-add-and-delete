import React, { useEffect, useRef, useState } from 'react';

type Props = {
  hasTodos: boolean;
  isAllCompleted: boolean;
  isDisabled: boolean;
  todosCount: number;
  onAdd: (title: string) => Promise<boolean>;
  onEmptyTitle: () => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  isAllCompleted,
  isDisabled,
  todosCount,
  onAdd,
  onEmptyTitle,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, todosCount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onEmptyTitle();

      return;
    }

    const isSuccess = await onAdd(trimmedTitle);

    if (isSuccess) {
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={
            isAllCompleted
              ? 'todoapp__toggle-all active'
              : 'todoapp__toggle-all'
          }
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isDisabled}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
