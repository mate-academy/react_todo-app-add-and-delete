import React from 'react';
import { Filter } from './../Filter';

type Props = {
  numberOfCompleted: number;
  numberOfActive: number;
  selectedFilter: string;
  onFilter: (currentFilter: string) => void;
  onClearCompleted: () => Promise<void[]>;
};

export const Footer: React.FC<Props> = ({
  numberOfActive,
  numberOfCompleted,
  selectedFilter,
  onFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {numberOfActive} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter selectedFilter={selectedFilter} onFilter={onFilter} />
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!numberOfCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
