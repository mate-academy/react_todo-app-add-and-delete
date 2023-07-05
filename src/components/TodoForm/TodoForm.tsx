import React, { useState } from 'react';
import { Todo } from '../../types/todo';

interface Props {
  setError: (error: string) => void;
  onTodoAdd: (title: string) => void;
  tempTodo: Todo | null;
}

export const TodoForm: React.FC<Props> = ({
  setError,
  onTodoAdd,
  tempTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title can\'t be empty');

      return;
    }

    await onTodoAdd(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
        disabled={Boolean(tempTodo)}
      />
    </form>
  );
};
