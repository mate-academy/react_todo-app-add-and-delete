import React, {memo, useEffect, useRef, useState} from 'react';
import { TodoError } from '../../types/TodoError';

interface Props {
  onAdd: (todoTitle: string) => void;
  isLoading: boolean;
  onLoad: (status: boolean) => void;
  setError: (error: TodoError) => void ;
  setIsError: (status: boolean) => void;
}

export const TodoForm: React.FC<Props> = memo(({
  onAdd,
  isLoading,
  onLoad,
  setError,
  setIsError,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      onLoad(false);
      setError(TodoError.ERROR_EMPTY_TITLE);
      setIsError(true);

      return;
    }

    onAdd(query);

    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={isLoading}
        ref={inputRef}
      />
    </form>
  );
});
