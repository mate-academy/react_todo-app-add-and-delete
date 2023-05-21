/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { TodoData } from '../types/Todo';

interface Props {
  setIsCreatingError: (arg: boolean) => void;
  addTodo: (todoData: TodoData) => Promise<void>;
}

export const AddTodoForm: React.FC<Props> = ({
  setIsCreatingError,
  addTodo,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setIsCreatingError(true);

      return;
    }

    const todoData = {
      title,
      userId: 10397,
      completed: false,
    };

    addTodo(todoData);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form action="/api/users" method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
