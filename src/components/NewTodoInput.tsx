import React, { useEffect, useRef, useState } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  addTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
};

export const NewTodoInput: React.FC<Props> = ({
  setErrorMessage,
  addTodo,
  handleAddTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!addTodo && inputRef.current) {
      handleFocus();
    }
  }, [addTodo]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();

    if (trimmedValue === '') {
      setErrorMessage(ErrorTypes.EMPTY_TITLE);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } else {
      setErrorMessage(null);

      try {
        await handleAddTodo(trimmedValue);
        setInputValue('');
      } catch (error) {
        setErrorMessage(ErrorTypes.ADD_TODO_FAILED);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        ref={inputRef}
        disabled={addTodo}
      />
    </form>
  );
};
