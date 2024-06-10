import React from 'react';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  completedTodos: number;
  notCompletedTodos: number;
  filter: string;
  setFilter: (filter: string) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  notCompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          // className={classNames('filter__link', { selected: filter === '' })}
          className={`filter__link ${filter === 'all' ? `selected` : ``}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          // className={classNames('filter__link', {
          //   selected: filter === Filter.Active,
          // })}
          className={`filter__link ${filter === Filter.Active ? `selected` : ``}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          // className={classNames('filter__link', {
          //   selected: filter === Filter.Completed,
          // })}
          className={`filter__link ${filter === Filter.Completed ? `selected` : ``}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
