/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setError: (error: string) => void;
  addTodo: (title: string) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({ setError, addTodo, tempTodo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title can\'t be empty');

      return;
    }

    await addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">

      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => {
            setNewTodoTitle(e.target.value);
          }}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
