import React, { useEffect, useRef, useState } from 'react';

import { ErrorMessage } from '../../types/ErrorMessage';
import type { Todo } from '../../types/Todo';

interface Props {
  onAdd: (title: string) => Promise<void>;
  setTempTodo: (todo: Todo | null) => void;
  showErrorNotification: (error: ErrorMessage) => void;
}

export const Header: React.FC<Props> = React.memo((props) => {
  const {
    onAdd,
    setTempTodo,
    showErrorNotification,
  } = props;

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      showErrorNotification(ErrorMessage.INPUT_ERROR);

      return;
    }

    setIsLoading(true);

    onAdd(preparedTitle)
      .then(() => setTitle(''))
      .catch(() => {
        showErrorNotification(ErrorMessage.ADD_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={() => inputRef.current?.focus()}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
