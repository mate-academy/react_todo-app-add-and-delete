import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

import { MessageError } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  loading: boolean;
  addTodo: (text: string) => Promise<boolean>;
  setIsError: (value: boolean) => void;
  setErrorMessage: (str: MessageError) => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  loading,
  addTodo,
  setIsError,
  setErrorMessage,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, todos]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setIsError(true);
      setErrorMessage(MessageError.queryError);

      return;
    }

    addTodo(query)
      .then(isSuccess => {
        if (isSuccess) {
          setQuery('');
        }
      })
      .finally(() => {
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};
