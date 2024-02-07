import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

interface Props {
  setQuery: (param: FilterBy) => void,
  query: FilterBy,
}

export const Filter: React.FC<Props> = ({ setQuery, query }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={
          classNames(
            'filter__link',
            { selected: query === 'all' },
          )
        }
        data-cy="FilterLinkAll"
        onClick={() => setQuery('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            'filter__link',
            { selected: query === 'active' },
          )
        }
        data-cy="FilterLinkActive"
        onClick={() => setQuery('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            'filter__link',
            { selected: query === 'completed' },
          )
        }
        data-cy="FilterLinkCompleted"
        onClick={() => setQuery('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
