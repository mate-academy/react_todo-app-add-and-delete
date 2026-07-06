/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  todosCount: number;
  allTodosCompleted: boolean;
  newTodoTitle: string;
  isAdding: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  onAddTodo: (event: React.FormEvent) => void;
  onNewTodoTitleChange: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  todosCount,
  allTodosCompleted,
  newTodoTitle,
  isAdding,
  newTodoField,
  onToggleAll,
  onAddTodo,
  onNewTodoTitleChange,
}) => (
  <header className="todoapp__header">
    {todosCount > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onAddTodo}>
      <input
        ref={newTodoField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        disabled={isAdding}
        onChange={event => onNewTodoTitleChange(event.target.value)}
      />
    </form>
  </header>
);
