import classNames from 'classnames';
import React, { SetStateAction } from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  amountOfActive: number,
  completedTodosLength: number,
  statusFilter: Filter,
  onChangeStatusFilter: React.Dispatch<SetStateAction<Filter>>,
  clearCompletedTodos: () => void,
};

export const AppFooter: React.FC<Props> = ({
  amountOfActive,
  completedTodosLength,
  statusFilter: status,
  onChangeStatusFilter,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${amountOfActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: status === 'All' })}
          onClick={() => onChangeStatusFilter('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: status === 'Active' })}
          onClick={() => onChangeStatusFilter('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: status === 'Completed' })}
          onClick={() => onChangeStatusFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          onChangeStatusFilter('All');
          clearCompletedTodos();
        }}
        hidden={completedTodosLength === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
