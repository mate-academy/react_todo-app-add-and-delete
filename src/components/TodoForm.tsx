import React, { useState, useRef, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const { handleSubmit, isLoading, errorMessage } = useTodoContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, errorMessage]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await handleSubmit(title);

    if (result) {
      setTitle('');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
