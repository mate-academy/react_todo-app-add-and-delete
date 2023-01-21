import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  filter: string,
  isCompleted: boolean,
  onCompletedClear: () => void,
  onFilterChange: (filterType: string) => void,
};

enum Filters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const Filter: React.FC<Props> = ({
  filter,
  isCompleted,
  onCompletedClear,
  onFilterChange,
}) => {
  const compareFilter = (filterName: string) => {
    return classNames(
      'filter__link',
      {
        selected: filter === filterName,
      },
    );
  };

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {` ${1} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={compareFilter('all')}
            onClick={() => onFilterChange(Filters.All)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={compareFilter('active')}
            onClick={() => onFilterChange(Filters.Active)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={compareFilter('completed')}
            onClick={() => onFilterChange(Filters.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onCompletedClear()}
          style={!isCompleted
            ? { visibility: 'hidden' }
            : {}}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
