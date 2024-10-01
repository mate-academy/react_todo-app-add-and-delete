import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  onAddTodo: (title: string, completed: boolean) => Promise<Todo | undefined>;
}

export const Header: React.FC<HeaderProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const newTodo = await onAddTodo(title, completed);

      if (newTodo) {
        setTitle('');
        setCompleted(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '' : ''}
        </button>
      </form>
    </header>
  );
};

