import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';

type Props = {
  onSubmit: (todo: Todo) => void;
  USER_ID: number;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const TodoHeader: React.FC<Props> = (
  { onSubmit, USER_ID, setError },
) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    if (query.trim()) {
      onSubmit(newTodo);

      setQuery('');
    } else {
      setError(ErrorType.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
