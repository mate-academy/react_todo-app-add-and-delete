import React from 'react';

type Props = {
  title: string,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  createNewTitle: (title: string) => void,
};

export const Header: React.FC<Props> = React.memo(
  ({
    title,
    handleSubmit,
    createNewTitle,
  }) => {
    return (
      <header className="todoapp__header">
        <button
          aria-label="btn"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={({ target }) => createNewTitle(target.value)}
          />
        </form>
      </header>
    );
  },
);
