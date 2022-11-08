import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType
  setFilterType: (status: FilterType) => void
  todos: Todo[]
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  setFilterType,
  todos,
}) => {
  const uncompletedCount = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  const filterTypeList = useMemo(() => (
    Object.values(FilterType)
  ), []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypeList.map(status => (
          <a
            data-cy="FilterLinkAll"
            href="#/"
            key={status}
            className={classNames('filter__link', {
              selected: filterType === status,
            })}
            onClick={() => setFilterType(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
});
