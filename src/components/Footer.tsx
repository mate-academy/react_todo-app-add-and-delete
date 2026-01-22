import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface Props {
  onSelect: (selectedFilter: Filter) => void;
  selectedFilter: Filter;
  todosCounter: () => number;
  clearCompleted: () => void;
  todosCompletedCounter: number;
}

const filters = [
  {
    key: Filter.all,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    key: Filter.active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    key: Filter.completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  onSelect,
  selectedFilter,
  todosCounter,
  clearCompleted,
  todosCompletedCounter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter()} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(({ key, href, label, dataCy }) => (
          <a
            key={key}
            href={href}
            className={classNames('filter__link', {
              selected: selectedFilter === key,
            })}
            data-cy={dataCy}
            onClick={() => onSelect(key)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCompletedCounter === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
