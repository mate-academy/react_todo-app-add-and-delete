import React, { useRef, useEffect, useState } from 'react';
import { ErrorStatus } from '../types/ErrorStatus';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorStatus>>;
  todoLength: number;
};

export const Header: React.FC<Props> = props => {
  const { onAddTodo, setErrorMessage, todoLength } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // if (inputRef.current) {
    // }
    inputRef?.current?.focus();
  }, [inputValue, isLoading, todoLength]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(ErrorStatus.EmptyTitle);

      return;
    }

    try {
      setIsLoading(true);
      await onAddTodo(inputValue.trim());
      inputRef?.current?.focus();
      setInputValue('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      inputRef?.current?.focus();
    }
  };

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
          disabled={isLoading}
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
