import React from 'react';

interface HeaderProps {
  value: string;
  onChange: (value: string) => void;
  onAddTodo: () => void;
  onToggleAll: () => void;
  loading: boolean;
  allCompleted: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  value,
  onChange,
  onAddTodo,
  onToggleAll,
  loading,
  allCompleted,
  inputRef,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        disabled={loading}
        onClick={onToggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="newTodo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
