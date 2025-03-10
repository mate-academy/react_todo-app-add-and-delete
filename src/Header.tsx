import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';

// Визначаємо кастомний тип для рефа
interface HeaderRef {
  focus: () => void;
}

interface HeaderProps {
  allCompleted: boolean;
  isLoading: boolean;
  onAdd: (tempTodo: Todo, onSuccess: () => void, onError: () => void) => void;
  onError: (message: string) => void;
}

// Використовуємо forwardRef з кастомним типом рефа
const Header = forwardRef<HeaderRef, HeaderProps>(
  ({ allCompleted, isLoading, onAdd, onError }, ref) => {
    Header.displayName = 'Header'; // Додаємо displayName

    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Передаємо кастомний метод focus через useImperativeHandle
    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
      }),
      [],
    );

    useEffect(() => {
      if (!isLoading && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isLoading]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setTitle('');
        onError('Title should not be empty');

        return;
      }

      const tempTodo: Todo = {
        id: 0,
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      };

      onAdd(
        tempTodo,
        () => {
          setTitle('');
        },
        () => {
          setTitle(trimmedTitle);
        },
      );
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          disabled={isLoading}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            ref={inputRef}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

export default Header;
