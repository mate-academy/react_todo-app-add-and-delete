import React, { useState, useEffect, useRef } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  onError: (error: ErrorMessage) => void;
  onAddTodo: (title: string) => void;
  isAdding: boolean;
  isAddSuccessful: boolean;
  isDeleting: boolean;
};

export const Header: React.FC<Props> = ({
  onError,
  onAddTodo,
  isAdding,
  isAddSuccessful,
  isDeleting,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddSuccessful) {
      setTitle('');
    }
  }, [isAddSuccessful]);

  useEffect(() => {
    if (!isAdding && !isDeleting) {
      inputRef.current?.focus();
    }
  }, [isAdding, isDeleting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    onAddTodo(trimmedTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
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
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
