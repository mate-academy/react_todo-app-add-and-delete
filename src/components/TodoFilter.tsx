/* eslint-disable max-len */
import React, { useContext } from 'react';
import cn from 'classnames';

import { Filter } from '../types/Filter';
import { TodoContext } from './TodoContex';

const TodoFilter: React.FC = () => {
  const { filter, setFilter } = useContext(TodoContext);

  const filters = [
    {
      name: 'All', value: Filter.All, link: '#/', dataCy: 'FilterLinkAll',
    },
    {
      name: 'Active', value: Filter.Active, link: '#/active', dataCy: 'FilterLinkActive',
    },
    {
      name: 'Completed', value: Filter.Completed, link: '#/completed', dataCy: 'FilterLinkCompleted',
    },
  ];

  return (

    <nav className="filter" data-cy="Filter">
      {filters.map(item => (
        <a
          data-cy={item.dataCy}
          href={item.link}
          className={cn('filter__link', { selected: filter === item.value })}
          onClick={() => setFilter(item.value)}
        >
          {item.name}
        </a>
      ))}
    </nav>

  );
};

export default TodoFilter;
