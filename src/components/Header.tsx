/* eslint-disable no-console */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ErrorType } from '../types/Errors';

interface HeaderProps {
  onAddTodo: (title: string) => Promise<void>; // Изменено на Promise<void>
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
  const [isAdding, setIsAdding] = useState(false); // Новое состояние

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputRef, isSubmitting]);

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
      setErrorType(ErrorType.ADD_TODO); // Предполагаем, что у вас есть такой тип ошибки
    } finally {
      setIsAdding(false); // Сбрасываем флаг добавления
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
            autoFocus
            ref={inputRef}
            value={title}
            onChange={handleInputChange}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isSubmitting || isAdding} // Добавляем isAdding
          />
        </form>
      </header>
    </>
  );
};

export default Header;
