import React, { useState } from 'react';

import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  itemCount: number,
};

export const FilterList: React.FC<Props> = ({ itemCount }) => {
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);

  const handleFilter = (newValue: string) => {
    setFilterBy(newValue as Filter);
    // it'll be filter function here
  };

  return (
    <>
      <span className="todo-count" data-cy="todosCounter">
        {`${itemCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: filterBy === Filter.all })}
          onClick={() => {
            handleFilter(Filter.all);
          }}
        >
          {Filter.all}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterBy === Filter.active })}
          onClick={() => {
            handleFilter(Filter.active);
          }}
        >
          {Filter.active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterBy === Filter.completed })}
          onClick={() => {
            handleFilter(Filter.completed);
          }}
        >
          {Filter.completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </>
  );
};
