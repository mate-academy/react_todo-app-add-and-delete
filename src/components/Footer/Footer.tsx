import React from 'react';
import cn from 'classnames';

import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodos: number;
  hasCompletedTodos: boolean;
  filterType: FilterType;
  onChangeType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Footer: React.FC<Props> = (props) => {
  const {
    activeTodos,
    hasCompletedTodos,
    filterType,
    onChangeType,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => onChangeType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => onChangeType(FilterType.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => onChangeType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        {hasCompletedTodos
          ? 'Clear completed'
          : null}
      </button>
    </footer>
  );
};
