import React from 'react';
import classNames from 'classnames';

import { FilterMode } from '../../types/FilterMode';

const filterModes = Object.values(FilterMode);

type Props = {
  currentFilterMode: FilterMode,
  onFilterModeChange: (newFilterMode: FilterMode) => void;
};

export const TodosFilter: React.FC<Props> = React.memo(({
  currentFilterMode,
  onFilterModeChange,
}) => {
  return (
    <nav className="filter">
      {filterModes.map(filterMode => {
        const filterModeLowercased = filterMode.toLowerCase();
        const isCurrentFilterMode = filterMode === currentFilterMode;

        return (
          <a
            key={filterMode}
            href={`#/${filterModeLowercased}`}
            className={classNames(
              'filter__link',
              { selected: isCurrentFilterMode },
            )}
            onClick={() => onFilterModeChange(filterMode)}
          >
            {filterMode}
          </a>
        );
      })}
    </nav>
  );
});
