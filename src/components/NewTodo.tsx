import React, { useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAdd: (title: string) => Promise<void>;
  onError: (error: ErrorMessage | null) => void;
};

export const NewTodo: React.FC<Props> = ({
  isSubmitting,
  inputRef,
  onAdd,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.TITLE);

      return;
    }

    try {
      await onAdd(trimmedTitle);
      setTitle('');
    } catch {
      // keep the entered text on error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};
