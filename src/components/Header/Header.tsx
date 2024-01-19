import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onSubmit: (title: string) => Promise<void>;
  error: string;
  setError: (er: string) => void;
  loading: boolean;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  error,
  setError,
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [isProcesing, setIsProcesing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcesing]);

  const reset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcesing(true);

    if (!title.trim()) {
      setError(ErrorMessage.EmptyTitle);
      setTitle('');

      return;
    }

    onSubmit(title.trim())
      .then(() => {
        if (!error) {
          reset();
        }
      })
      .finally(() => setIsProcesing(false));
  };

  const handleTitleChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleTitleChage}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};
