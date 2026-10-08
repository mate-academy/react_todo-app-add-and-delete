import React from 'react';
import { TodoFilter as Filter } from '../types/TodoFilter';
import { TodoFilter } from './TodoFilter';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <TodoFilter filter={filter} onFilterChange={onFilterChange} />

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
