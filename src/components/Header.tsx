import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../App';

type Props = {
  todos: Todo[];
  setTodos: (value: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  completedTodos: number;
  setCurrentError: (error: '' | ErrorType) => void;
  onTodoAdd: (todo: Todo) => void;
  shouldFocusInput?: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  setCurrentError,
  onTodoAdd,
  shouldFocusInput = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (shouldFocus || shouldFocusInput) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, shouldFocusInput]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setCurrentError(ErrorType.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    setIsLoading(true);
    setCurrentError('');

    try {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      await onTodoAdd(newTodo as Todo);
      setTitle('');
    } catch (error) {
      setCurrentError(ErrorType.UnableToAddTodo);
    } finally {
      setIsLoading(false);
      setShouldFocus(true);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length === completedTodos,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </form>
    </header>
  );
};
