import classNames from 'classnames';
import React from 'react';

type Props = {
  active: () => number;
  completed: () => number;
  status: string;
  onFilterChange: (type: string) => void;
  filterTypes: { type: string; href: string; dataCy: string; label: string }[];
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  active,
  completed,
  status,
  onFilterChange,
  filterTypes,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active()} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypes.map(filter => (
          <a
            key={filter.type}
            href={filter.href}
            className={classNames('filter__link', {
              selected: status === filter.type,
            })}
            data-cy={filter.dataCy}
            onClick={() => onFilterChange(filter.type)}
          >
            {filter.label}
          </a>
        ))}
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
