import React from 'react';
import cn from 'classnames';
import { useTodos } from '../../utils/TodoContext';
import { Filter } from '../../types/Filter';

export const TodoFilter: React.FC = () => {
  const { filter, setFilter } = useTodos();
  const filterMenu = Object.values(Filter);

  return (
    <nav className="filter" data-cy="Filter">
      {filterMenu.map(filterOption => (
        <a
          key={filterOption}
          href={filterOption === Filter.ALL ? '#/' : `#/` + filterOption}
          data-cy={`FilterLink${filterOption}`}
          className={cn('filter__link', {
            selected: filter === filterOption,
          })}
          onClick={() => setFilter(filterOption)}
        >
          {filterOption}
        </a>
      ))}
    </nav>
  );
};
