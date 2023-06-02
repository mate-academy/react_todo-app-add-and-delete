import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../type/Todo';

type Props = {
  todos: Todo[],
  querySearch: string,
  setQuerySearch: (query: string) => void,
  handleAddTodo: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  querySearch,
  setQuerySearch,
  handleAddTodo,
}) => {
  const isActicve = todos.filter(todo => !todo.completed);
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    handleAddTodo();
    setQuerySearch('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActicve },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={querySearch}
          onChange={(event) => setQuerySearch(event.target.value)}
        />
      </form>
    </header>
  );
};
