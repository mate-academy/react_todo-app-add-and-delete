/* eslint-disable no-console */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ErrorType } from '../types/Errors';
import ErrorNotification from './ErrorNotification';

interface HeaderProps {
  onAddTodo: (title: string) => void;
  isSubmitting: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddTodo, isSubmitting }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>('');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCloseError = () => setErrorType(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorType(ErrorType.EMPTY_TITLE);

      return;
    }

    onAddTodo(title);
    setTitle('');
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
            disabled={isSubmitting}
          />
        </form>
      </header>
      {errorType && (
        <ErrorNotification
          errorType={errorType}
          handleCloseError={handleCloseError}
        />
      )}
    </>
  );
};

export default Header;
