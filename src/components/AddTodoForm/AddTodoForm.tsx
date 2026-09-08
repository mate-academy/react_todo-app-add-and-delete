import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  setError: (msg: ErrorType | null) => void;
  onSubmit: (msg: string) => Promise<void>;
}

export const AddTodoForm = React.forwardRef<HTMLInputElement, Props>(
  ({ setError = () => {}, onSubmit = () => Promise.resolve() }, ref) => {
    const [fieldValue, setFieldValue] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const field = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => field.current as HTMLInputElement);

    useEffect(() => {
      if (field.current) {
        field.current.focus();
      }
    }, [isSubmitting]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setError(null);

      const title = fieldValue.trim();

      if (title.length === 0) {
        setError(ErrorType.EmptyTitle);

        return;
      }

      setIsSubmitting(true);

      onSubmit(title)
        .then(() => {
          setFieldValue('');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    return (
      <form onSubmit={e => handleSubmit(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={fieldValue}
          ref={field}
          disabled={isSubmitting}
          onChange={e => setFieldValue(e.target.value)}
        />
      </form>
    );
  },
);

AddTodoForm.displayName = 'AddTodoForm';
