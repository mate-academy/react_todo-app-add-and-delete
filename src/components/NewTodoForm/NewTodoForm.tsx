import React, { useEffect, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  addTodo: (title: string) => Promise<void>;
  setNewError: (newErrorMessage: Errors) => void;
};

export const NewTodoForm: React.FC<Props> = ({ addTodo, setNewError }) => {
  const [query, setQuery] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, [addTodo]);

  const createTodo = (todoTitle: string) => {
    if (!todoTitle.trim()) {
      setNewError(Errors.EmptyTitle);

      return;
    }

    setIsAdded(true);
    addTodo(todoTitle)
      .then(() => {
        setQuery('');
      })
      .finally(() => {
        setIsAdded(false);
      });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        createTodo(query);
      }}
    >
      <input
        ref={field}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={event => setQuery(event.target.value)}
        disabled={isAdded}
      />
    </form>
  );
};
