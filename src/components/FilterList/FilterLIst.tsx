import React, { useState } from 'react';

import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  itemCount: number,
  onFilter: (filterBy: Filter) => void,
  isCompletedTodo: boolean,
};

export const FilterList: React.FC<Props> = ({
  itemCount,
  onFilter,
  isCompletedTodo,
}) => {
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);

  const setFilter = (filterState: Filter) => {
    setFilterBy(filterState);
    onFilter(filterState);
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
            setFilter(Filter.all);
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
            setFilter(Filter.active);
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
            setFilter(Filter.completed);
          }}
        >
          {Filter.completed}
        </a>
      </nav>

      {isCompletedTodo && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            setFilter(Filter.clearComplete);
          }}
        >
          {Filter.clearComplete}
        </button>
      )}
    </>
  );
};
