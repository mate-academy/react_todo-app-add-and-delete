import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTitle: string;
  setNewTitle: (value: string) => void;
  handleAddTodo: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
  handleToggleAll?: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTitle,
  setNewTitle,
  handleAddTodo,
  inputRef,
  isLoading,
  handleToggleAll,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isLoading}
          autoFocus
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
