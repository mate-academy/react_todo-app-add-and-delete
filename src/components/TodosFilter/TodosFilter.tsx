import React, { useContext } from 'react';
import classNames from 'classnames';

import { FilterMode } from '../../types/Filter';
import { AppContext } from '../AppContext/AppContext';

const filterModes = Object.values(FilterMode);

export const TodosFilter: React.FC = React.memo(() => {
  const {
    currentFilterMode,
    setCurrentFilterMode,
  } = useContext(AppContext);

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
            onClick={() => setCurrentFilterMode(filterMode)}
          >
            {filterMode}
          </a>
        );
      })}
    </nav>
  );
});
