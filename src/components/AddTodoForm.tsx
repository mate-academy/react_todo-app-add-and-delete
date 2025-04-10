/* eslint-disable max-len */
import React, { useRef, useEffect, useState } from 'react';
import '../styles/todo.scss';
import '../styles/todoapp.scss';
type AddTodoFormProps = {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (title: string) => Promise<void>;
  isAdding: boolean;
};

export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  isAdding,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Automatically focus the input field on mount
  }, []);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty'); // Show notification for empty title

      return;
    }

    await handleAddTodo(trimmedTitle); // Call handleAddTodo with the trimmed title
    setNewTodoTitle('');
    setErrorMessage('');
    inputRef.current?.focus(); // Refocus the input field
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={newTodoTitle} // Controlled component
        placeholder="Add a new task and press Enter"
        onChange={e => setNewTodoTitle(e.target.value)} // Update state on change
        className="todoapp__new-todo"
        disabled={isAdding}
      />
      <button type="submit" disabled={isAdding || !newTodoTitle.trim()}>
        {isAdding ? 'Adding...' : 'Add Todo'}
      </button>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};
