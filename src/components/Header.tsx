/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todos: Todo[],
  title: string,
  setTitle: (value: string) => void,
  addNewTodo: (value: string) => void;
  isAdding: boolean;
  setErrorMessage: (value: string) => void;
};

export const Header:React.FC<Props> = ({
  newTodoField,
  todos,
  setTitle,
  title,
  addNewTodo,
  isAdding,
  setErrorMessage,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage("Title can't be empty");

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addNewTodo(title);
  };

  useEffect(() => {
    if (!isAdding) {
      setTitle('');
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
