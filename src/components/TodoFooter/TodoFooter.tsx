import React from 'react';

type Props = {
  active: () => number;
  completed: () => number;
  status: string;
  filterAll: () => void;
  filterActive: () => void;
  filterCompleted: () => void;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  active,
  completed,
  status,
  filterAll,
  filterActive,
  filterCompleted,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active()} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            status === 'all' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={filterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            status === 'active' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={filterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            status === 'completed' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={filterCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completed() > 0 ? false : true}
      >
        Clear completed
      </button>
    </footer>
  );
};
