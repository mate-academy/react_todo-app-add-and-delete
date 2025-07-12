import React from 'react';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: string;
  setFilter: (filter: string) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span
      className="todoapp__todo-count"
      data-cy="TodosCounter"
      data-cy-other="ActiveCount"
    >
      {activeCount} item{activeCount !== 1 ? 's' : ''} left
    </span>

    <ul className="todoapp__filters" data-cy="Filter">
      <li>
        <button
          data-cy="FilterLinkAll"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          All
        </button>
      </li>
      <li>
        <button
          data-cy="FilterLinkActive"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          onClick={() => setFilter('active')}
          type="button"
        >
          Active
        </button>
      </li>
      <li>
        <button
          data-cy="FilterLinkCompleted"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          onClick={() => setFilter('completed')}
          type="button"
        >
          Completed
        </button>
      </li>
    </ul>

    <button
      data-cy="ClearCompletedButton"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      disabled={completedCount === 0}
      style={{ visibility: completedCount === 0 ? 'hidden' : 'visible' }}
    >
      Clear completed
    </button>
  </footer>
);
