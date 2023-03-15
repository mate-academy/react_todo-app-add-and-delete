import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  createTodoOnServer: (query: string) => void,
  setErrorMessage: (message: string) => void,
  isTodoLoaded: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  createTodoOnServer: postTodoOnServer,
  setErrorMessage,
  isTodoLoaded,
}) => {
  const isActiveTodos = todos.some(todo => todo.completed === false);
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setErrorMessage('Title can\'t be empty');
    }

    postTodoOnServer(query);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {isActiveTodos && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
          disabled={!isTodoLoaded}
        />
      </form>
    </header>
  );
};
