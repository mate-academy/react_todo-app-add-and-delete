import React, { useEffect, useState } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = props => {
  const { onAddTodo, setErrorMessage, inputRef } = props;

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    setIsLoading(true);

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {
      setErrorMessage(ErrorType.AddTodo);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
