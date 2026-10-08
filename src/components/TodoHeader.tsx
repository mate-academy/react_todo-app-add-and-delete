/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';

type Props = {
  title: string;
  isAdding: boolean;
  hasTodos: boolean;
  allCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  title,
  isAdding,
  hasTodos,
  allCompleted,
  inputRef,
  onTitleChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        aria-label="New todo"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isAdding}
        autoFocus
      />
    </form>
  </header>
);
