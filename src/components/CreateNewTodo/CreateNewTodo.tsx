import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | null>>;
  onAddTodo: (newTitle: string) => void;
  isLoading: boolean;
}

export const CreateNewTodo: React.FC<Props> = ({
  setErrorMessage,
  onAddTodo,
  isLoading,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
    setErrorMessage(null);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleTodoTitleChange}
        disabled={isLoading}
      />
    </form>
  );
};
