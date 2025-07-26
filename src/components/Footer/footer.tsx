import React from 'react';
import { FilterType } from '../../types/Todo';

interface Props {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  activeCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

const labels: Record<FilterType, string> = {
  [FilterType.All]: 'All',
  [FilterType.Active]: 'Active',
  [FilterType.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  hasCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} {activeCount === 1 ? 'item' : 'items'} left
    </span>
    <nav className="filter" data-cy="Filter">
      {Object.entries(labels).map(([key, text]) => {
        const ft = key as FilterType;

        return (
          <a
            key={key}
            href={`#/${ft === FilterType.All ? '' : ft}`}
            className={`filter__link ${filter === ft ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              setFilter(ft);
            }}
            data-cy={`FilterLink${text}`}
          >
            {text}
          </a>
        );
      })}
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!hasCompleted}
      onClick={onClearCompleted}
      data-cy="ClearCompletedButton"
    >
      Clear completed
    </button>
  </footer>
);
