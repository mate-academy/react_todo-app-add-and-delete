import classNames from 'classnames';
import { FilterType, Props } from './FilterPropTypes';

export const Filter :React.FC<Props> = ({ filterType, setFilterType }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.All },
        )}
        onClick={() => setFilterType(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.Active },
        )}
        onClick={() => setFilterType(FilterType.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.Completed },
        )}
        onClick={() => setFilterType(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
