import React, { useCallback, useMemo, useContext } from 'react';
import cn from 'classnames';

import { Tabs } from '../types/Tabs';
import { TodosContext } from '../context/TodosContext';

export const Filters: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useContext(TodosContext);

  const enumToArray = useCallback((data: typeof Tabs): string[] => {
    return Object.values(data);
  }, []);

  const filters = useMemo(() => enumToArray(Tabs), [enumToArray]);

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filter => (
        <a
          key={filter}
          href={`#/${filter !== Tabs.All
            ? filter.toLowerCase()
            : ''}`}
          className={cn(
            'filter__link',
            { selected: selectedFilter === filter },
          )}
          data-cy={cn({
            FilterLinkAll: filter === Tabs.All,
            FilterLinkActive: filter === Tabs.Active,
            FilterLinkCompleted: filter === Tabs.Completed,
          })}
          onClick={() => setSelectedFilter(filter as Tabs)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
