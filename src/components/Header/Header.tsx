import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  addTodo: (title: string) => void;
  setEmptyTitleError?: (message: ErrorMessage) => void;
}

export const Header: React.FC<Props> = ({ addTodo, setEmptyTitleError }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    } else {
      setEmptyTitleError?.(ErrorMessage.EmptyTitle);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
