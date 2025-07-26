import React from 'react';

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onAddTodo: (e: React.FormEvent) => void;
  allCompleted: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onAddTodo,
  allCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
      data-cy="ToggleAllButton"
    />
    <form onSubmit={onAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
    </form>
  </header>
);
