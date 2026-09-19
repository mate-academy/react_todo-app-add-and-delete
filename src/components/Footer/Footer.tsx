import React from 'react';
import cn from 'classnames';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';

type Props = {
  totalTodos: number;
  complitedTodos: number;
  selectedFilter: TodoFilterStatus;
  deleteCompletedTodos: () => void;
  setTodoFilter: (value: TodoFilterStatus) => void;
};

export const Footer: React.FC<Props> = ({
  totalTodos,
  complitedTodos,
  selectedFilter,
  deleteCompletedTodos,
  setTodoFilter,
}) => {
  return (
    totalTodos > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {totalTodos - complitedTodos} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: TodoFilterStatus.All === selectedFilter,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setTodoFilter(TodoFilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: TodoFilterStatus.Active === selectedFilter,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setTodoFilter(TodoFilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: TodoFilterStatus.Completed === selectedFilter,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setTodoFilter(TodoFilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteCompletedTodos}
          disabled={complitedTodos === 0}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
