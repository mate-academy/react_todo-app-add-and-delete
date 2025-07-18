import React from 'react';
import '../styles/index.scss';
import classNames from 'classnames';

interface Props {
  activeCount: number;
  completedCount: number;
  currentFilter: FilterKey;
  onFilterChange: (key: FilterKey) => void;
  onClearCompleted: () => void | Promise<void>;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];
type FilterItem = (typeof FILTERS)[number];

const TodoFooter: React.FC<Props> = ({
  activeCount,
  completedCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTERS.map(({ key, label }: FilterItem) => (
        <a
          key={key}
          href={`#/${key === 'all' ? '' : key}`}
          className={classNames('filter__link', {
            selected: currentFilter === key,
          })}
          data-cy={`FilterLink${label}`}
          onClick={() => onFilterChange(key)}
        >
          {label}
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

export default React.memo(TodoFooter);
