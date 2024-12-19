import React, { useEffect, useState, useRef } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes>>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = props => {
  const { onAddTodo, setErrorMessage, isLoading } = props;

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(ErrorTypes.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {}
  };

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled={isLoading}
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
