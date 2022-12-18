import classNames from 'classnames';
import { memo } from 'react';
import { TodoFilters } from '../../types/TodoFilters';

type Props = {
  onFilterBy: (filter: TodoFilters) => void
  currentFilter: TodoFilters
};

export const TodoFilter: React.FC<Props> = memo(({
  onFilterBy,
  currentFilter,
}) => {
  const { all, active, completed } = TodoFilters;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: all === currentFilter,
          },
        )}
        onClick={() => onFilterBy(all)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: active === currentFilter,
          },
        )}
        onClick={() => onFilterBy(active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: completed === currentFilter,
          },
        )}
        onClick={() => onFilterBy(completed)}
      >
        Completed
      </a>
    </nav>
  );
});
