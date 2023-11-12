import React from 'react';
import classNames from 'classnames';

import { FilterParam } from '../types/FilterParam';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isOneTodoCompleted: boolean;
  filterParam: FilterParam;
  setFilterParam: (newValue: FilterParam) => void;
  deleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  isOneTodoCompleted,
  filterParam,
  setFilterParam,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos
          .filter(({ completed }) => completed === false).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterParam === FilterParam.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterParam(FilterParam.All)}
        >
          All
        </a>
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterParam === FilterParam.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterParam(FilterParam.Completed)}
        >
          Completed
        </a>
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterParam === FilterParam.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterParam(FilterParam.Active)}
        >
          Active
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isOneTodoCompleted}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
