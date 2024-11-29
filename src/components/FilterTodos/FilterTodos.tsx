import cn from 'classnames';

interface Props {
  filterQuery: string;
  setFilterQuery: (newQuery: string) => void;
}

export const FilterTodos: React.FC<Props> = ({
  filterQuery,
  setFilterQuery,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        //Active link has the 'selected' class
        className={cn('filter__link', {
          selected: filterQuery === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterQuery('all')}
      >
        All
      </a>

      <a
        href="#/active"
        //Active link has 'selected' class
        className={cn('filter__link', {
          selected: filterQuery === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterQuery('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        //Active link has 'selected' class
        className={cn('filter__link', {
          selected: filterQuery === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterQuery('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
