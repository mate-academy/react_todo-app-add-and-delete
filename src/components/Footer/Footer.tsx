import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  count: number;
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const Footer = ({
  count,
  activeFilter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
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
