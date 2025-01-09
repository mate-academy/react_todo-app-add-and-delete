import React from 'react';

interface HeaderProps {
  newTodo: string;
  setNewTodo: (value: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  newTodo,
  setNewTodo,
  handleAddTodo,
  isLoading,
  inputRef,
}) => (
  <header className="todoapp__header">
    <form onSubmit={handleAddTodo}>
      <input
        ref={inputRef}
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        autoFocus
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isLoading}
      />
    </form>
  </header>
);
