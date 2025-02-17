import React, { useEffect, useRef, useState } from 'react';
import { Errors } from '../../constants/Errors';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  setError: (e: string) => void;
  onCreate: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
};

export const Header: React.FC<Props> = ({
  setError,
  onCreate,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const inputElement = useRef<HTMLInputElement | null>(null);

  function reset() {
    setTitle('');
  }

  function onSubmitTodo(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setError(Errors.emptyTitle);
      setTimeout(() => setError(''), 3000);

      return;
    }

    setTitle(trimmedTitle);

    onCreate({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    }).then(reset);
  }

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputElement}
          autoFocus
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
