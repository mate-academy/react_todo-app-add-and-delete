/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

type Props = {
  createNewTodo: (title: string) => void;
};

export const Header: React.FC<Props> = ({ createNewTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
