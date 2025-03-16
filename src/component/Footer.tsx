import classNames from 'classnames';
import { FilterProps } from '../App';

interface FooterProps {
  currentFilter: FilterProps;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: FilterProps) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentFilter,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterProps).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType}`}
            className={classNames('filter__link', {
              selected: currentFilter === filterType,
            })}
            data-cy={`FilterLink${filterType[0].toUpperCase() + filterType.slice(1)}`}
            onClick={() => onFilterChange(filterType)}
          >
            {filterType[0].toUpperCase() + filterType.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
