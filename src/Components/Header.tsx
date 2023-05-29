/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

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
