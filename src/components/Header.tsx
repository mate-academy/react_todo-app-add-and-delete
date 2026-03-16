import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  activeTodosCount: number;
  loading: boolean;
  field: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleAddTodo: (event: React.FormEvent) => void;
  setTodoTitle: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  activeTodosCount,
  loading,
  field,
  todoTitle,
  handleAddTodo,
  setTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.length > 0 && activeTodosCount === 0 ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        disabled={loading || todos.length === 0}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={field}
          value={todoTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
