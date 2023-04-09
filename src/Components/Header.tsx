import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderPropsType {
  todos: Todo[],
  searchQuery: string,
  setSearchQuery: (searchQuery: string) => void,
  addTodo: (title: string) => unknown,
  onEmpty: () => void,
  addDisabled: boolean,
}

export const Header: React.FC<HeaderPropsType> = ({
  todos,
  searchQuery,
  setSearchQuery,
  addTodo,
  onEmpty,
  addDisabled,
}) => {
  const isActicve = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActicve },
        )}
        aria-label="Add todo"
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (!searchQuery.trim()) {
            onEmpty();
          } else {
            addTodo(searchQuery);
          }
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          disabled={addDisabled}
        />
      </form>
    </header>
  );
};
