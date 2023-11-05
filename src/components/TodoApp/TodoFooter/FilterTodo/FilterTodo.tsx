import React, { useContext } from 'react';
import cn from 'classnames';

import './FilterTodo.scss';

import {
  DispatchContext,
  StateContext,
  actionCreator,
} from '../../../TodoStore';
import { Filter } from '../../../../types/Filter';

export const FilterTodo: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { selectedFilter } = useContext(StateContext);

  const handleFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const filter = (event.target as HTMLAnchorElement).innerText as Filter;

    dispatch(actionCreator.selectFilter(filter));
    dispatch(actionCreator.updateTodos({ filter }));
  };

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(filter => (
        <a
          key={filter}
          href={`#/${filter}`}
          className={cn('filter__link', {
            selected: selectedFilter === filter,
          })}
          data-cy={`FilterLink${filter}`}
          onClick={handleFilter}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
