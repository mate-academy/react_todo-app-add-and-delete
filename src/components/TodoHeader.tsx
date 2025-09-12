import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';
import { USER_ID } from '../api/todos';

type Props = {
  onSetTitleError: (errorMessage: ErrorTypes | null) => void;
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  onSetTitleError,
  todos,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AllTodosCompleted = todos.every(todo => todo.completed);

  function reset() {
    setTitle('');
    onSetTitleError(null);
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    onSetTitleError(null);

    if (!title.trim()) {
      onSetTitleError('Title should not be empty');
      setTitle('');

      return;
    }

    const completed = false;
    const userId = USER_ID;

    setIsSubmitting(true);

    onSubmit({ title, completed, userId })
      .then(reset)
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => inputRef.current?.focus(), [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: AllTodosCompleted,
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
          value={title}
          onChange={handleChangeTitle}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
