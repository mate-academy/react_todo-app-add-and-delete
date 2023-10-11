import cn from 'classnames';
import { Filter } from '../types/Filters';

type TodoFilterProps = {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
};

export const TodoFilter: React.FC<TodoFilterProps> = (
  { filter, setFilter },
) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === 'all' })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: filter === 'active' })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: filter === 'completed' })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
