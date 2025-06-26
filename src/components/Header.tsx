import cn from 'classnames';
import React from 'react';

type Props = {
  allTodosAreActive: boolean;
  title: string;
  setTitle: (title: string) => void;
  addTodo: () => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  allTodosAreActive,
  title,
  setTitle,
  addTodo,
  loading,
  inputRef,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosAreActive })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
