import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  onSubmit: (title: string) => Promise<void>,
  loaded: boolean,
}

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  loaded,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(query);
    setQuery('');
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
  };

  return (
    <header className="todoapp__header">
      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="toggle-button"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeInput}
          disabled={loaded}
        />
      </form>
    </header>
  );
};
