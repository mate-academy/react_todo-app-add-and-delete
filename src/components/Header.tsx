import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  todoTitle: string;
  setTodoTitle: (v: string) => void;
  todos: Todo[];
  handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loadingTodoIds: number[];
  isCreating: boolean;
  toggleTodoAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todoTitle,
  setTodoTitle,
  todos,
  handleAddTodo,
  inputRef,
  loadingTodoIds,
  isCreating,
  toggleTodoAll,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(t => t.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={toggleTodoAll}
      />
    )}

    <form onSubmit={handleAddTodo}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={e => setTodoTitle(e.target.value)}
        disabled={isCreating || loadingTodoIds.length > 0}
      />
    </form>
  </header>
);
