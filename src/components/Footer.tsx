import { FilterType } from '../constants/FilterType';
import cn from 'classnames';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: FilterType;
  onClearCompleted: () => void;
  onFilterChange: (filter: FilterType) => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  onClearCompleted,
  onFilterChange,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(value => (
          <a
            key={`link-${value}`}
            href={`#/${value === 'all' ? '' : value.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value.charAt(0).toUpperCase() + value.slice(1)}`}
            onClick={() => onFilterChange(value)}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!completedCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
