import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  onCreateTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => void;
  errorMessage: string | null;
  setError: (message: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  onCreateTodo,
  errorMessage,
  setError,
  isLoading,
  setIsLoading,
  setTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [, setTemporaryTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const title = titleTodo.trim();
      const completed = false;
      const userId = USER_ID;

      if (!title) {
        setError('Title should not be empty');

        return;
      }

      const newTodo = {
        title: title,
        completed: completed,
        userId: userId,
      };

      setTempTodo({ id: 0, ...newTodo });
      setIsLoading(true);

      try {
        await onCreateTodo({ title, completed, userId });
        setTitleTodo('');
        setError(null);
        setTemporaryTodo(null);
      } catch (error) {
        setError('Failed to create todo');
      } finally {
        setTempTodo(null);
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={e => e.preventDefault()}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={e => setTitleTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
