import React from 'react';

type Props = {
  isLoading: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (event: React.FormEvent) => void;
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  isLoading,
  title,
  setTitle,
  handleSubmit,
  inputRef,
  allCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
      data-cy="ToggleAllButton"
      disabled={isLoading}
    />
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isLoading}
      />
    </form>
  </header>
);
