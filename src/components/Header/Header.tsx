import React, { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  addNewTodo: string;
  setAddNewTodo: (value: string) => void;
  handleSubmit: (event: FormEvent) => void;
  loading: boolean;
}

export const Header = React.forwardRef<HTMLInputElement, HeaderProps>(
  ({ todos, addNewTodo, setAddNewTodo, handleSubmit, loading }, ref) => {
    const hasTodos = todos.length > 0;

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
          disabled={!hasTodos}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={addNewTodo}
            onChange={event => setAddNewTodo(event.target.value)}
            disabled={loading}
            ref={ref}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
