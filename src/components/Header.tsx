/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErorrType';

type Props = {
  todos: Todo[],
  addTodo:(title: string) => void;
  setErrorMessage: (error: string) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  tempTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorType.Title);

      return;
    }

    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}
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
    </header>
  );
};
