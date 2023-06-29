import React, { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  setError: (error: string) => void;
  addTodo: (title: string) => void;
  tempTodo: Todo | null;
};

export const TodoForm: React.FC<Props> = ({ setError, addTodo, tempTodo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title can\'t be empty');

      return;
    }

    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
        disabled={tempTodo !== null}
      />
    </form>
  );
};
