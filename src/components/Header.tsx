import React, { useRef, useEffect } from 'react';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onAdd: (event: React.FormEvent) => Promise<void>;
  isAdding: boolean;
  todoCount: number;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAdd,
  isAdding,
  todoCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoCount, isAdding]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        disabled
      />

      <form onSubmit={onAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
