/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  newTitle: string,
  setNewTitle: (newTitle: string) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">

      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </header>

  );
};
