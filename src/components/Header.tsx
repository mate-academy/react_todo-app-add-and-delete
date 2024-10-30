import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  todos: Todo[];
}

const Header: React.FC<HeaderProps> = ({
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  handleSubmit,
  isSubmitting,
  todos,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
      data-cy="ToggleAllButton"
    />
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        autoFocus
        disabled={isSubmitting}
      />
    </form>
  </header>
);

export default Header;
