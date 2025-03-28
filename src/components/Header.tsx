import React from 'react';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAllCompleted: boolean;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleAddTodo,
  isAllCompleted,
  loading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all${isAllCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
