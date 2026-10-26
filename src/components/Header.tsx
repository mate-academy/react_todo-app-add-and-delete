import React from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (title: string) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  todosLength,
  allCompleted,
  handleSubmit,
  newTodoFieldRef,
  title,
  setTitle,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          autoFocus
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};