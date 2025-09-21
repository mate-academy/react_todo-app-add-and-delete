import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  onError: (message: string) => void;
  onAddTodo: (title: string) => Promise<Todo>;
  todos: Todo[];
};

export const Header: React.FC<HeaderProps> = ({
  onError,
  onAddTodo,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevTodosRef = useRef<Todo[]>([]);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const clearInput = useCallback(() => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const prevTodos = prevTodosRef.current;
    const currentTodos = todos;

    if (prevTodos.length > 0 && currentTodos.length < prevTodos.length) {
      focusInput();
    }

    prevTodosRef.current = currentTodos;
  }, [todos, focusInput]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimValue = inputRef.current?.value.trim();

    if (!trimValue) {
      onError(ERROR_MESSAGE.EMPTY_TITLE);
      focusInput();

      return;
    }

    setIsLoading(true);

    try {
      await onAddTodo(trimValue);
      clearInput();
      focusInput();
    } catch {
      onError(ERROR_MESSAGE.ADD_TODO);
      focusInput();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          disabled={isLoading}
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
