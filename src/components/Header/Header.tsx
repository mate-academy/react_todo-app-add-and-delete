import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  CreateTodo: (title: string) => void;
  neError: (errorMes: ErrorMessage) => void;
};

export const Header: React.FC<Props> = ({ CreateTodo, neError }) => {
  const [query, setQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputTodo.current) {
      inputTodo.current.focus();
    }
  }, [query, isSubmitting]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      CreateTodo(query);
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);

      setQuery('');
    } else {
      neError(ErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQuery}
          ref={inputTodo}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
