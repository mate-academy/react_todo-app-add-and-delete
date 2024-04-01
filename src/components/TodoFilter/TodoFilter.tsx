import React from 'react';
import cn from 'classnames';

import { Filter } from '../../types';

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  const allFilterValues = Object.values(Filter);

  return (
    <nav className="filter" data-cy="Filter">
      {allFilterValues.map(currentFilterValue => (
        <a
          key={currentFilterValue}
          href="#/"
          data-cy={`FilterLink${currentFilterValue}`}
          className={cn('filter__link', {
            selected: filter === currentFilterValue,
          })}
          onClick={() => setFilter(currentFilterValue)}
        >
          {currentFilterValue}
        </a>
      ))}
    </nav>
  );
};

export default TodoFilter;
