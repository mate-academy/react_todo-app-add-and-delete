import React from 'react';
import { FilterType } from '../../constants/Filter';
import { Filter } from '../Filter';

type Props = {
  activeTodosCounter: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCounter,
  filter,
  onFilterChange,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter} items left
      </span>

      <Filter filter={filter} onFilterChange={onFilterChange} />

      {/* this button should be disabled if there are no completed todos */}
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
