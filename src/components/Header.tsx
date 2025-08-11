import React from 'react';

interface HeaderProps {
  areAllTodosCompleted: boolean;
  handleToggleAllTodos: () => Promise<void>;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isAddingTodo: boolean;
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  areAllTodosCompleted,
  handleToggleAllTodos,
  handleSubmit,
  newTodoTitle,
  setNewTodoTitle,
  isAddingTodo,
  newTodoFieldRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllTodos}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        {' '}
        {/* Використовуємо handleSubmit */}
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isAddingTodo}
          ref={newTodoFieldRef}
        />
      </form>
    </header>
  );
};
