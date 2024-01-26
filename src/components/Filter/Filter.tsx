import cn from 'classnames';
import { useContext } from 'react';
import { FilterItem } from '../../types/FilterItem';
import { TodosContext } from '../TodosContext/TodosContext';

export const Filter: React.FC = () => {
  const { filter, setFilter } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === FilterItem.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(FilterItem.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === FilterItem.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(FilterItem.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FilterItem.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(FilterItem.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
