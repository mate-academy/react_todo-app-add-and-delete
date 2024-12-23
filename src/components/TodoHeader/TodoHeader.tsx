import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = props => {
  const { onAddTodo, setErrorMessage, inputRef } = props;

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElement = inputRef.current;

    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    if (inputElement) {
      inputElement.disabled = true;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {
    } finally {
      if (inputElement) {
        inputElement.disabled = false;
        inputElement.focus();
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
