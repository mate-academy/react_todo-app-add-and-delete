import React, { forwardRef, RefObject, useEffect, useState } from 'react';
import { TodoErrors } from '../../types/Error';

type Props = {
  onAddTodo: (title: string) => Promise<boolean>;
  onError: (error: TodoErrors) => void;
  isSubmitting: boolean;
};

export const TodoForm = forwardRef<HTMLInputElement, Props>(
  ({ onAddTodo, onError, isSubmitting }, ref) => {
    const [title, setTitle] = useState<string>('');
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedValue = title.trim();

      if (!trimmedValue) {
        onError(TodoErrors.EMPTY_TITLE);
        (ref as RefObject<HTMLInputElement>).current?.focus();

        return;
      }

      setIsFormSubmitting(true);

      try {
        const response = await onAddTodo(trimmedValue);

        if (response) {
          setTitle('');
        }
      } finally {
        setIsFormSubmitting(false);
        setTimeout(
          () => (ref as RefObject<HTMLInputElement>).current?.focus(),
          0,
        );
      }
    };

    useEffect(() => {
      (ref as RefObject<HTMLInputElement>).current?.focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isFormSubmitting || isSubmitting}
        />
      </form>
    );
  },
);

TodoForm.displayName = 'TodoForm';
