import React, { memo, useEffect, useRef } from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAddNewTodo: (event: React.FormEvent) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = memo(({
  newTitle,
  setNewTitle,
  onAddNewTodo,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onAddNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
