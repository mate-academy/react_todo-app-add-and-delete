import React, { useState } from 'react';

type Props = {
  addNewTodo: (newTodo: string) => void;
  isInputDisabled: boolean;
};

export const FormTodo: React.FC<Props> = ({ addNewTodo, isInputDisabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodo(inputValue);
    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-hidden="true"
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputForm}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
