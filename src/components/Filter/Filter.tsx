import classNames from 'classnames';
import { useFilterContext } from '../Context/Context';
import { Filters } from '../../App';

export const Filter: React.FC = () => {
  const { filter, changeFilter } = useFilterContext();

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filters.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => changeFilter(Filters.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filters.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => changeFilter(Filters.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filters.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => changeFilter(Filters.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
