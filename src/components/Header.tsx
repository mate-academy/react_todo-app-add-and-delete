import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  addTodo: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  todos: Todo[];
}

export const Header: React.FC<HeaderProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
  isInputDisabled,
  todos,
}) => {
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          ref={newTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
