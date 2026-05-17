import { FilterStatus } from '../types/FilterStatus';
import { Filter } from '../types/Filter';

type Props = {
  filters: readonly Filter[];
  filterStatus: FilterStatus;
  setFilterStatus: (value: FilterStatus) => void;
  activeTodosCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filters,
  filterStatus,
  setFilterStatus,
  activeTodosCount,
  hasCompleted,
  onClearCompleted,
}) => {
  const handleFilterChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    value: FilterStatus,
  ) => {
    e.preventDefault();
    setFilterStatus(value);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={`#/${filter.value}`}
            className={`filter__link ${filterStatus === filter.value ? 'selected' : ''}`}
            onClick={e => handleFilterChange(e, filter.value)}
            data-cy={`FilterLink${filter.label}`}
          >
            {filter.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        disabled={!hasCompleted}
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
