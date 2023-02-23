import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setErrorMessage: (message: string) => void,
  createTodoOnServer: (query: string) => void,
  isTodosLoaded: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  createTodoOnServer: postTodoToServer,
  isTodosLoaded,
}) => {
  const isActiveTodos = todos.some(todo => todo.completed === false);
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    postTodoToServer(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {isActiveTodos
      /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
      && <button type="button" className="todoapp__toggle-all active" />}
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={!isTodosLoaded}
        />
      </form>
    </header>
  );
};
