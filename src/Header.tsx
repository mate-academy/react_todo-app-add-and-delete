import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';

interface HeaderProps {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<boolean>;
  onToggleAll: () => void;
  disabled: boolean;
  onError: (message: string) => void;
  shouldFocusInput?: number;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  onAddTodo,
  onToggleAll,
  disabled,
  onError,
  shouldFocusInput,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);
  useEffect(() => {
    if (shouldFocusInput && shouldFocusInput > 0) {
      focusInput();
    }
  }, [shouldFocusInput]);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = inputValue.trim();

    if (trimmedTitle) {
      const success = await onAddTodo(trimmedTitle);

      if (success) {
        setInputValue('');
      }
    } else {
      onError('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        aria-label="Toggle all todos"
      ></button>

      <form onSubmit={handleSubmit}>
        <input
          disabled={disabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </form>
    </header>
  );
};
