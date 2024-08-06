import React, { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  loading: boolean;
  onAddTodo: (title: string) => void;
  onToggleAllTodos: () => void;
  allCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  loading,
  onAddTodo,
  onToggleAllTodos,
  allCompleted,
}) => {
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [newTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
