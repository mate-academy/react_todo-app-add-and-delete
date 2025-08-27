import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Result } from '../types/Results';

type Props = {
  onFormSubmit: (result: Result) => Promise<boolean>;
  isLoading: boolean;
  lastAction: number;
};

export const NewTodoForm: React.FC<Props> = ({
  onFormSubmit,
  isLoading,
  lastAction,
}) => {
  const [todoName, setTodoName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const preparedTodoName = todoName.trim();

    if (preparedTodoName) {
      const isSuccess = await onFormSubmit({
        isSuccess: true,
        value: preparedTodoName,
      });

      if (isSuccess) {
        setTodoName('');
      }

      inputRef.current?.focus();
    } else {
      onFormSubmit({
        isSuccess: false,
        error: ErrorMessage.EmptyTitle,
      });
    }
  };

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, lastAction]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoName}
        onChange={event => setTodoName(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
