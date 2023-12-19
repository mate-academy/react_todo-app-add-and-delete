import cn from 'classnames';

import { FilterOption } from '../../enum/FilterOption';
import { useTodosContext } from '../store';

export const TodoFilter = () => {
  const { filterSelected, setFilterSelected } = useTodosContext();

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterSelected === FilterOption.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterSelected(FilterOption.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterSelected === FilterOption.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterSelected(FilterOption.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterSelected === FilterOption.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterSelected(FilterOption.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
