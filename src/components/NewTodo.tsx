import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  isAdding: boolean;
  focusRequest: number;
  onAdd: (title: string) => Promise<boolean>;
  onError: (error: ErrorMessage) => void;
};

export const NewTodo: React.FC<Props> = ({
  isAdding,
  focusRequest,
  onAdd,
  onError,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, focusRequest]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    onError(ErrorMessage.None);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    const isCreated = await onAdd(trimmedTitle);

    if (isCreated) {
      setTitle('');
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
        disabled={isAdding}
        autoFocus
      />
    </form>
  );
};
