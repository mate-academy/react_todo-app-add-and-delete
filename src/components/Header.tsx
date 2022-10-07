import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setErrorName: (value: string) => void,
  onSetQuery: (value: string) => void,
  onSetError: (value: boolean) => void,
  onPostNewTodo: (value: string) => void
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoField,
  title,
  onSetQuery,
  onSetError,
  setErrorName,
  onPostNewTodo,
  isAdding,
}) => {
  const handleChange = (e: { target: { value: string; }; }) => {
    onSetQuery(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (title.length === 0) {
      onSetError(true);
      setErrorName("Title can't be empty");
    }

    if (title.length > 0) {
      onPostNewTodo(title);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="button"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
