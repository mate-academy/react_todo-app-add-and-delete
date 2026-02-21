/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  allCompleted: boolean;
  newTitle: string;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onNewTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  allCompleted,
  newTitle,
  isAdding,
  inputRef,
  onNewTitleChange,
  onSubmit,
}) => {
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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          onChange={event => onNewTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
