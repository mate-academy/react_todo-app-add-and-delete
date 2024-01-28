import React, { useEffect, useRef, useState } from 'react';
import { Error } from '../types/Error';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (title: string) => Promise<void>,
  error: string,
  setError: (er: string) => void,
  loading: boolean,
};

export const Header: React.FC<Props> = ({
  addTodo,
  error,
  setError,
  loading,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [isLoad, setIsLoad] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoad]);

  const reset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoad(true);

    if (!title.trim()) {
      setError(Error.submit);
      setTitle('');

      return;
    }

    addTodo(title.trim())
      .then(() => {
        if (!error) {
          reset();
        }
      })
      .finally(() => {
        setIsLoad(false);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          aria-label="toggleButton"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={loading}
          value={title}
        />
      </form>
    </header>
  );
};
