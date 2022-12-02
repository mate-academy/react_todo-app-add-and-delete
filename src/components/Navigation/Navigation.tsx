import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterBy: string;
  setFilterBy: (filterBy: Filter) => void;
};

export const Navigation: React.FC<Props> = ({ filterBy, setFilterBy }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={
        classNames('filter__link', { selected: filterBy === Filter.All })
      }
      onClick={() => setFilterBy(Filter.All)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={
        classNames('filter__link', { selected: filterBy === Filter.ACTIVE })
      }
      onClick={() => setFilterBy(Filter.ACTIVE)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={
        classNames('filter__link', { selected: filterBy === Filter.COMPLETED })
      }
      onClick={() => setFilterBy(Filter.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
