import React, { MutableRefObject } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  processingIds: number[];
  handleAddTodo: (e: React.FormEvent) => void;
  handleToggleAll: () => void;
  newTitle: string;
  setNewTitle: (value: string) => void;
  newTodoField: MutableRefObject<HTMLInputElement | null>;
  isCreatingTodo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  processingIds,
  handleAddTodo,
  handleToggleAll,
  newTitle,
  setNewTitle,
  newTodoField,
  isCreatingTodo,
}) => {
  return (
    <header className="todoapp__header">
      <h1 className="todoapp__title">todos</h1>

      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={processingIds.length > 0}
        />
      )}

      {/* Додати завдання під час надсилання форми */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          ref={newTodoField}
          disabled={isCreatingTodo}
        />
      </form>
    </header>
  );
};
