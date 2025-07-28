import React from 'react';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddTodo: () => void;
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  isCreating,
  inputRef,
  handleAddTodo,
  allCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
      data-cy="ToggleAllButton"
    />

    <form
      onSubmit={e => {
        e.preventDefault();
        handleAddTodo();
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        disabled={isCreating}
        ref={inputRef}
        autoFocus
      />
    </form>
  </header>
);
