import React, { useEffect, useRef } from 'react';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

type Props = {
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  onSubmit: (todo: Todo) => void;
  USER_ID: number;
  query: string;
  tempTodo: Todo | null;
  setQuery: (query: string) => void;
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  setError,
  onSubmit,
  USER_ID,
  query,
  setQuery,
  tempTodo,
  handleToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim()) {
      event.preventDefault();

      onSubmit(
        {
          userId: USER_ID,
          title: query.trim(),
          completed: false,
          id: 0,
        },
      );
      setQuery('');
    } else {
      setError(ErrorType.TitleError);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleQueryChange}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
