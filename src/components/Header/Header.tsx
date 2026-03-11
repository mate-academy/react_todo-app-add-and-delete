import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  isLoading: boolean;
  allCompleted: boolean;
  focusTrigger: number;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  title,
  isLoading,
  allCompleted,
  focusTrigger,
  onTitleChange,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, focusTrigger]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all${allCompleted ? ' active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
