import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  completedTodos: number;
  setCurrentError: (error: '' | ErrorType) => void;
  onTodoAdd: (todo: Todo) => void;
  focusInput?: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  setCurrentError,
  onTodoAdd,
  focusInput = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (shouldFocus || focusInput) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, focusInput]);

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
