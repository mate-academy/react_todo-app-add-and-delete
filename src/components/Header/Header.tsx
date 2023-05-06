import React from 'react';
import classNames from 'classnames';

interface Props {
  query: string;
  isQueryDisabled: boolean;
  filteredTodosLength: number;
  handleQueryChange: (value: string) => void;
  isEveryTodoCompleted: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Header: React.FC<Props> = ({
  query,
  isQueryDisabled,
  filteredTodosLength,
  handleQueryChange,
  isEveryTodoCompleted,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {(filteredTodosLength > 0) && (
        <button
          type="button"
          aria-label="ToggleAll"
          className={classNames('todoapp__toggle-all', {
            active: isEveryTodoCompleted,
          })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          readOnly={isQueryDisabled}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
      </form>
    </header>
  );
};
