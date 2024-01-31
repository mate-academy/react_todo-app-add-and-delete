/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { ErrorTp } from '../types/error';

type Props = {
  createNewTodo: (title: string) => void;
  setErrors:(error: ErrorTp | null) => void;
};

export const Header: React.FC<Props> = ({ createNewTodo, setErrors }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 1) {
      setErrors(ErrorTp.title_error);
    } else {
      createNewTodo(title);
      setTitle('');
      setErrors(null);
    }
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
