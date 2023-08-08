import React from 'react';

type Props = {
  query: string,
  setQuery: (value: string) => void,
  onSubmit: (event: React.FormEvent) => void,
};

export const NewTodo: React.FC<Props> = ({
  query,
  setQuery,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
    </form>
  );
};
