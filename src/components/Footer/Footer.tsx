import React from 'react';
import cn from 'classnames';
import { Filter } from '../../App';
import { Todo } from '../../types/Todo';

type Props = {
  notCompletedTodos: Todo[];
  completedTodos: Todo[];
  clearCompletedTodos: () => void;
  appliedFilter: Filter;
  handleFilterChange: (filter: Filter) => void;
};

const FooterBase: React.FC<Props> = ({
  notCompletedTodos,
  completedTodos,
  clearCompletedTodos,
  appliedFilter,
  handleFilterChange,
}) => {
  const notCompletedTodosLength = notCompletedTodos.length;
  const todoCounterText = `${notCompletedTodosLength} ${notCompletedTodosLength === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounterText}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: appliedFilter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: appliedFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: appliedFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        onClick={clearCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterBase);
