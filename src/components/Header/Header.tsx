import React from 'react';
import classNames from 'classnames';

type Props = {
  isAllCompleted: boolean;
  onToogleAllTodo: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  query: string
  onEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  onToogleAllTodo,
  handleSubmit,
  query,
  onEventChange,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        onClick={onToogleAllTodo}
      />

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => {
            onEventChange(e);
          }}
        />
      </form>
    </header>
  );
};
