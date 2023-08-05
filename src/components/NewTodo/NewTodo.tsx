import React from 'react';

type Props = {
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  query: string,
  setQuery: (v: string) => void,
  isAdding: boolean,
};

export const NewTodo: React.FC<Props> = React.memo(({
  addTodo, query, setQuery, isAdding,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <form onSubmit={addTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={handleChange}
        disabled={isAdding}
      />
    </form>
  );
});
