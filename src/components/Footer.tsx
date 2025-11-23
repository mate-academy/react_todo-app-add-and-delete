import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Filter } from '../App';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href={`#/`}
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          onClick={() => onFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          onClick={() => onFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={() => onFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
