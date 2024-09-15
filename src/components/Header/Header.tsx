import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodos, USER_ID } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  errorMessage: string | null;
  setError: (message: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  errorMessage,
  setError,
  isLoading,
  setIsLoading,
  setTempTodo,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

  const isEveryTodoCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

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

      createTodos(newTodo)
        .then(todo => {
          setTodos([...todos, todo]);
          setTitleTodo('');
        })
        .catch(() => setError('Failed to create todo'))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {!isLoading && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryTodoCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

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
