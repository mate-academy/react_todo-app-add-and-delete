import React from 'react';

type Props = {
  newTitle: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  allCompleted: boolean;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  newTitle,
  onChange,
  onSubmit,
  allCompleted,
  isAdding,
  inputRef,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
      data-cy="ToggleAllButton"
    />

    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => onChange(e.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
