import React from 'react';

type Props = {
  title: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void
  todosLoading: number[]
};

export const Header: React.FC<Props> = ({
  title,
  handleChange,
  handleKeyUp,
  todosLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          disabled={!!todosLoading.length}
        />
      </form>
    </header>
  );
};
