import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onTodoAdd: (title: string) => Promise<void>;
  onError: (error: string) => void;
};

export const TodoappHeader: React.FC<Props> = ({
  onTodoAdd,
  onError,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');
      setTitle('');
      setIsLoading(false);

      return;
    }

    try {
      await onTodoAdd(trimmedTitle);
      setTitle('');
      inputRef.current?.focus();
    } catch (error) {
      onError('Unable to add a todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
