import React, { FormEvent, RefObject } from 'react';

interface HeaderProps {
  allCompleted: boolean;
  newTodoTitle: string;
  inputRef: RefObject<HTMLInputElement>;
  handleSubmit: (event: FormEvent) => void;
  setNewTodoTitle: (title: string) => void;
  isAdding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  allCompleted,
  newTodoTitle,
  inputRef,
  handleSubmit,
  setNewTodoTitle,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
