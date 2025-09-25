import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[];
  completedTodos: number;
  setCurrentError: (error: '' | ErrorType) => void;
  onTodoAdd: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  setCurrentError,
  onTodoAdd,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setCurrentError(ErrorType.EmptyTitle);

      return;
    }

    setIsLoading(true);

    try {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      await onTodoAdd(newTodo as Todo);
      setTitle('');
    } catch {
      setCurrentError(ErrorType.UnableToAddTodo);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, []);

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
          autoFocus={true}
          ref={newTodoFieldRef}
          id="new-todo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
