import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onError: (message: string) => void;
  onSubmit: (title: string) => Promise<void>;
  onFocus: React.RefObject<HTMLInputElement>;
};

const EMPTY_TITLE_ERROR = 'Title should not be empty';

export const TodoHeader: React.FC<Props> = ({
  todos,
  onError,
  onSubmit,
  onFocus,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onFocus.current?.focus();
  }, [isSubmitting, onFocus]);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onError(EMPTY_TITLE_ERROR);

      return;
    }

    setIsSubmitting(true);

    onSubmit(title.trim())
      .then(() => setTitle(''))
      .catch(() => {})
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={onFocus}
            value={title}
            onChange={event => setTitle(event.target.value)}
            disabled={isSubmitting}
          />
        </form>
      </header>
    </>
  );
};
