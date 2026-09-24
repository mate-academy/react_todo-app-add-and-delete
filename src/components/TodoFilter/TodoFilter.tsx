import classNames from 'classnames';

export enum FILTERS {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

type Props = {
  filter: FILTERS;
  onFilterChange: (filter: FILTERS) => void;
};

export const TodoFilter = ({ filter, onFilterChange }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={() => onFilterChange(FILTERS.ALL)}
        className={classNames('filter__link', {
          selected: filter === FILTERS.ALL,
        })}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        onClick={() => onFilterChange(FILTERS.ACTIVE)}
        className={classNames('filter__link', {
          selected: filter === FILTERS.ACTIVE,
        })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        onClick={() => onFilterChange(FILTERS.COMPLETED)}
        className={classNames('filter__link', {
          selected: filter === FILTERS.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
