/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

interface Props {
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
  newTitle: string;
  setNewTitle: (value: string) => void;
  isAdding: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const TodoHeader: React.FC<Props> = ({
  newTodoFieldRef,
  newTitle,
  setNewTitle,
  isAdding,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
