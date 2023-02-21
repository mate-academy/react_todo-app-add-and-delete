import React, { useState } from 'react';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  userId: number;
  onAddTodo: (title: string, userId: number) => void;
  onAddErrorMessage: (message: ErrorType) => void;
  isLoading: boolean;
}
export const AddTodoForm: React.FC<Props> = ({
  userId,
  onAddTodo,
  onAddErrorMessage,
  isLoading,
}) => {
  const [title, setTitle] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const resetForm = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validTitle = title.trim();

    if (!validTitle) {
      onAddErrorMessage(ErrorType.TITLE);
    }

    if (validTitle && userId) {
      onAddTodo(title, userId);
    }

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleInput}
        disabled={isLoading}
      />
    </form>
  );
};
