import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorMessages } from '../types/errorMessages';

type Props = {
  todos: Todo[];
  onErrorMessage: (error: ErrorMessages) => void;
  onAddTodo: (title: string) => Promise<void>;
  deletedTodosId: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  onErrorMessage,
  onAddTodo,
  deletedTodosId,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [titleQuery, setTitleQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onErrorMessage(ErrorMessages.none);

    const trimmedTitleQuery = titleQuery.trim();

    if (!trimmedTitleQuery) {
      onErrorMessage(ErrorMessages.titleIsEmpty);
      setTitleQuery('');

      return;
    }

    setSubmitting(true);

    await onAddTodo(trimmedTitleQuery)
      .then(() => {
        setTitleQuery('');
        onErrorMessage(ErrorMessages.none);
      })
      .finally(() => setSubmitting(false));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  useEffect(() => {
    if (!submitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitting, deletedTodosId]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          todos.every(todo => todo.completed) ? 'active' : '',
        )}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          value={titleQuery}
          data-cy="NewTodoField"
          type="text"
          name="inp"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={submitting}
          ref={inputRef}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
