import React, { useEffect, useRef } from 'react';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (title: string) => void;
  toggleAllTodos: () => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  toggleAllTodos,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  inputRef.current?.focus();

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo(newTodoTitle);
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
          autoFocus={!isLoading}
        />
      </form>
    </header>
  );
};
