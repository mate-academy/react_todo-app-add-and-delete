import React, { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  hasTodos: boolean;
  onAdd: (title: string) => void;
  onError: (error: ErrorType) => void;
};

export const NewTodo: React.FC<Props> = ({ hasTodos, onAdd, onError }) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedQuery = query.trim();

    if (preparedQuery) {
      onAdd(preparedQuery);
      setQuery('');
    } else {
      onError({ status: true, message: 'Title can\'t be empty' });
    }
  };

  return (
    <>
      {hasTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </>
  );
};
