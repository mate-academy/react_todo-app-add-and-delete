import React from 'react';
import { FilterType } from '../types/FilterType';

type Props = {
  filter: FilterType;
  onFilter: (filter: FilterType) => void;
  isSomeCompleted: boolean;
  counterNotCompleted: number;
  loading: boolean;
  handleDeleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  isSomeCompleted,
  counterNotCompleted,
  loading,
  handleDeleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterNotCompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link${filter === 'all' ? ' selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link${filter === 'active' ? ' selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
        disabled={!isSomeCompleted || loading}
      >
        Clear completed
      </button>
    </footer>
  );
};
