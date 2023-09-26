import cn from 'classnames';
import { Filter } from '../types/Todo';

type Props = {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: filter === 'All',
      })}
      data-cy="FilterLinkAll"
      onClick={() => setFilter('All')}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: filter === 'Active',
      })}
      data-cy="FilterLinkActive"
      onClick={() => setFilter('Active')}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: filter === 'Completed',
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => setFilter('Completed')}
    >
      Completed
    </a>
  </nav>
);
