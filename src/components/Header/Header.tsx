import React, { useEffect } from 'react';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAddTodo,
  isAdding,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
