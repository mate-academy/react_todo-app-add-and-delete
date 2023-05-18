import React, { useState } from 'react';
import { TodoData } from '../../types/TodoData';

interface Props {
  addTodo: (data: TodoData) => void;
  handleError: (value: string) => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  addTodo,
  handleError,
  isLoading,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!todoTitle.trim()) {
      handleError("Title can't be empty");

      return;
    }

    const newTodo = {
      userId: 10364,
      title: todoTitle,
      completed: false,
    };

    addTodo(newTodo);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label  */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
