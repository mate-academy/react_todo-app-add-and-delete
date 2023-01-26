import cn from 'classnames';
import { memo } from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterType, setFilterType: onChangeFilterType } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.All },
        )}
        onClick={() => onChangeFilterType(FilterType.All)}
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
        onClick={() => onChangeFilterType(FilterType.Active)}
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
        onClick={() => onChangeFilterType(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
