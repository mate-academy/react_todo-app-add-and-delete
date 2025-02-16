import React from 'react';

interface HeaderProps {
  newTodo: string;
  disabled: boolean;
  onNewTodoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  newTodo,
  disabled,
  onNewTodoChange,
  onAddTodo,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all"
      ></button>
      <form onSubmit={onAddTodo}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          disabled={disabled}
          onChange={onNewTodoChange}
        />
      </form>
    </header>
  );
};
