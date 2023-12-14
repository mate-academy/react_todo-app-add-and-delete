import React, { useContext, useState } from 'react';
import { TodoContext } from '../TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoForm = () => {
  const {
    addTodo,
    loading,
    USER_ID,
    setErrorMessage,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');
  const isDisabled = loading !== null;

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim().length) {
      addTodo({
        id: Math.random(),
        title: inputValue,
        completed: false,
        userId: USER_ID,
      });
    } else {
      setErrorMessage(ErrorMessage.EmptyTitle);
    }

    setInputValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isDisabled}
      />
    </form>
  );
};
