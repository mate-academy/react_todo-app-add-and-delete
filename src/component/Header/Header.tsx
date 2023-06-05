import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[],
  addTodo: (title: string) => void;
  query: string,
  setQuery: (query: string) => void,
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  addTodo,
  query,
  setQuery,
}) => {
  const handleSubmit = (event:React.SyntheticEvent) => {
    event.preventDefault();
    addTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.some(todo => !todo.completed) },
        )}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
