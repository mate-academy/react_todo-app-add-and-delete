import React from 'react';
import cn from 'classnames';

type Props = {
  filter: (filter: string) => void,
  filterValue: string,
  completedTodos: number,
  uncompletedTodos: number,
  handleMultipleDelete: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filter,
  filterValue,
  completedTodos,
  uncompletedTodos,
  handleMultipleDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link', { selected: filterValue === 'all' },
          )}
          data-cy="FilterLinkAll"
          onClick={() => {
            filter('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: filterValue === 'active' },
          )}
          data-cy="FilterLinkActive"
          onClick={() => {
            filter('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: filterValue === 'completed' },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            filter('completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0 && true}
        onClick={handleMultipleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
});
