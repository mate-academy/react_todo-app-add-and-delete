import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (arg: Filter) => void;
};

export const Navigation: React.FC<Props> = ({ filter, setFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={cn('filter__link',
        {
          selected: filter === Filter.ALL,
        })}
      onClick={() => {
        setFilter(Filter.ALL);
      }}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={cn('filter__link',
        {
          selected: filter === Filter.ACTIVE,
        })}
      onClick={() => {
        setFilter(Filter.ACTIVE);
      }}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={cn('filter__link',
        {
          selected: filter === Filter.COMPLETED,
        })}
      onClick={() => {
        setFilter(Filter.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
