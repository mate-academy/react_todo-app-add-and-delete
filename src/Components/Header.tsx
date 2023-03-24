import { useState } from 'react';

type Props = {
  isLoading: boolean,
  createdTodo: (newTitle: string) => void,
};

export const Header: React.FC<Props> = ({ isLoading, createdTodo }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createdTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="All"
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          disabled={isLoading}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
