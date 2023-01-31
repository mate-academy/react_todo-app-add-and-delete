import React, { memo } from 'react';
import cn from 'classnames';
import { Filter } from '../helpers/filterTodos';

type Props = {
  activeTodos: number,
  completeTodosCount: number,
  filterOption: Filter,
  onChangeFilterType: (str: Filter) => void
};

export const TodoFooter: React.FC<Props> = memo(({
  activeTodos,
  filterOption,
  onChangeFilterType,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterOption === Filter.all,
          })}
          onClick={() => onChangeFilterType(Filter.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterOption === Filter.active,
          })}
          onClick={() => onChangeFilterType(Filter.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterOption === Filter.completed,
          })}
          onClick={() => onChangeFilterType(Filter.completed)}
        >
          Completed
        </a>
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
