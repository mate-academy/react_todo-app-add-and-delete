import React, { FormEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  addNewTodo: string;
  setAddNewTodo: (value: string) => void;
  handleSubmit: (event: FormEvent) => void;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  addNewTodo,
  setAddNewTodo,
  handleSubmit,
  loading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addNewTodo}
          onChange={event => setAddNewTodo(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
