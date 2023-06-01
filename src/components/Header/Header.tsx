import React from 'react';

type Props = {
  title: string,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (event: React.FormEvent) => void,
  todosLoading: number[],
};

export const Header: React.FC<Props> = ({
  title,
  handleChange,
  handleSubmit,
  todosLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={!!todosLoading.length}
        />
      </form>
    </header>
  );
};
