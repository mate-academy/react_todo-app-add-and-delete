import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  onAddTodo: (title: string) => Promise<void>;
  onError: (message: ErrorMessage | null) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({ onAddTodo, onError, inputRef }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const activeRef = inputRef || internalRef;

  useEffect(() => {
    if (!isSubmitting) {
      activeRef.current?.focus();
    }
  }, [isSubmitting, activeRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError(ErrorMessage.TITLE);

      return;
    }

    setIsSubmitting(true);
    onError(null);

    onAddTodo(title.trim())
      .then(() => setTitle(''))
      .catch(() => {})
      .finally(() => setIsSubmitting(false));
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={activeRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
