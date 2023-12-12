import React, { useContext, useState } from 'react';
import { TodoContext } from '../TodoContext';

export const TodoForm = () => {
  const {
    addTodo,
    isLoading,
    USER_ID,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      id: Math.random(),
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo);
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
        disabled={!!isLoading}
      />
    </form>
  );
};
