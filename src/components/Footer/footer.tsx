import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

export enum FilterEnum {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

type Props = {
  countOfTodos: number;
  filter: FilterEnum;
  setFilter: (filter: FilterEnum) => void;
  handleClearCompleted: () => void;
  completedTodos: Todo[] | null;
};

export const Footer: React.FC<Props> = ({
  countOfTodos,
  filter,
  setFilter,
  completedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterEnum.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterEnum.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterEnum.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos?.length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
