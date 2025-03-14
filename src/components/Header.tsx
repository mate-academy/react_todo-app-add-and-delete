import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleToggleAllClick: () => void;
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  addTodo: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleToggleAllClick,
  query,
  handleQueryChange,
  inputRef,
  addTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleToggleAllClick}
      />
      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          ref={inputRef}
          autoFocus
          disabled={todos.some(todo => todo.isSubmitting)}
        />
      </form>
    </header>
  );
};
