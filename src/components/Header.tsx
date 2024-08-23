/* eslint-disable no-console */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ErrorType } from '../types/Errors';

interface HeaderProps {
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  setErrorType: (error: ErrorType) => void;
}

const Header: React.FC<HeaderProps> = ({
  onAddTodo,
  isSubmitting,
  setErrorType,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Фокусируемся на поле ввода, когда завершены все операции
    if (!isSubmitting && !isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, isAdding]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // Изменено на async
    event.preventDefault();
    if (!title.trim()) {
      setErrorType(ErrorType.EMPTY_TITLE);

      return;
    }

    setIsAdding(true); // Устанавливаем флаг добавления
    try {
      await onAddTodo(title);
      setTitle('');
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.ADD_TODO);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={title}
            onChange={handleInputChange}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isSubmitting || isAdding}
          />
        </form>
      </header>
    </>
  );
};

export default Header;
