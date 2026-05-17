import React from 'react';
import { Filter } from './Filter';
import { Status } from '../types/Status';

type Props = {
  activeTodosCount: number;
  filter: Status;
  onFilterChange: (status: Status) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <Filter filter={filter} onFilterChange={onFilterChange} />

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
};
