import classNames from 'classnames';
import React, { useEffect, useMemo, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  resetError: () => void;
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  // completed: boolean;
  todos: Todo[];
  submitting: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  errorMessage,
  setErrorMessage,
  resetError,
  addTodo,
  // completed,
  todos,
  submitting,
}) => {
  const formField = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(resetError, 3000);

      return;
    }

    addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  const allCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  useEffect(() => {
    formField.current?.focus();
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={formField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={submitting}
        />
      </form>
    </header>
  );
};
