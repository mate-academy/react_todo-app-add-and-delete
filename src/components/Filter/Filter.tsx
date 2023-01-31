import { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterType, setFilterType } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
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
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.Active },
        )}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.Completed },
        )}
        onClick={() => setFilterType(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
