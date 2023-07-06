import React, { useState } from 'react';
import { Todo } from './types/Todo';

interface Props {
  tempTodo: Todo | null,
  addTodo: (title: string) => void;
  setErrorText: (error: string) => void;
}

export const TodoForm: React.FC<Props> = ({
  tempTodo,
  addTodo,
  setErrorText,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query === '') {
      setErrorText('Title can\'t be empty');

      return;
    }

    await addTodo(query);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={tempTodo !== null}
      />
    </form>
  );
};
