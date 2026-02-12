import classNames from 'classnames';
import { Filter } from '../enums/Filter';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const FILTERS = [
  { label: 'All', value: Filter.All, cy: 'FilterLinkAll' },
  { label: 'Active', value: Filter.Active, cy: 'FilterLinkActive' },
  {
    label: 'Completed',
    value: Filter.Completed,
    cy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(item => (
          <a
            key={item.value}
            href={`#/${item.value === Filter.All ? '' : item.value}`}
            data-cy={item.cy}
            className={classNames('filter__link', {
              selected: filter === item.value,
            })}
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
