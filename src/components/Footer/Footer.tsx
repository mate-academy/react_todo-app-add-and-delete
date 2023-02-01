import React, { memo } from 'react';
import cn from 'classnames';

import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosAmount: number;
  hasCompletedTodos: boolean;
  filterType: FilterType;
  onChangeType: React.Dispatch<React.SetStateAction<FilterType>>;
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    activeTodosAmount,
    hasCompletedTodos,
    filterType,
    onChangeType,
    onDeleteCompletedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} items left`}
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

      {hasCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
