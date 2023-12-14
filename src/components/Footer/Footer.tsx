import React from 'react';
import cn from 'classnames';

import { TodoListState } from '../../types/TodoListState';

interface FooterProps {
  activeTodos: number;
  completedTodos: number;
  filter: string;
  setFilter: (newFilter: TodoListState) => void;
  clearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodos,
  completedTodos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    filterType: TodoListState,
  ) => {
    event.preventDefault();
    setFilter(filterType);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos === 1 ? (
          `${activeTodos} item left`
        ) : (
          `${activeTodos} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: !filter,
          })}
          data-cy="FilterLinkAll"
          onClick={(event) => handleFilterClick(event, TodoListState.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={(event) => handleFilterClick(event, TodoListState.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={(event) => handleFilterClick(event, TodoListState.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
