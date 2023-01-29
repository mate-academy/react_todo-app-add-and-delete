import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterCondition } from '../../types/FilterCondition';

type Props = {
  todosList: Todo[],
  filterCondition: FilterCondition,
  setFilterCondition: (value: FilterCondition) => void,
  deleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = memo(({
  todosList,
  filterCondition,
  setFilterCondition,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosList.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            {
              selected: filterCondition === FilterCondition.ALL,
            })}
          onClick={() => setFilterCondition(FilterCondition.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            {
              selected: filterCondition === FilterCondition.ACTIVE,
            })}
          onClick={() => setFilterCondition(FilterCondition.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            {
              selected: filterCondition === FilterCondition.COMPLETED,
            })}
          onClick={() => setFilterCondition(FilterCondition.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
