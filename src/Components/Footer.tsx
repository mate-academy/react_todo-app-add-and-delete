import React from 'react';

interface Props {
  activeTodosCount: number;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filterStatus,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => {
  const filters = ['All', 'Active', 'Completed'];

  const handleFilterClick =
    (status: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onFilterChange(status);
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(status => (
          <a
            key={status}
            href={`#/${status === 'All' ? '' : status.toLowerCase()}`}
            className={`filter__link ${filterStatus === status ? 'selected' : ''}`}
            data-cy={`FilterLink${status}`}
            onClick={handleFilterClick(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
