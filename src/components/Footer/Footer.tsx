import classNames from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';
import { capitalize } from '../../helpers/capitalize';

type Props = {
  allTodosCount: number;
  activeTodosCount: number;
  filterBy: FilterBy;
  onFilterTodos: (status: FilterBy) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  allTodosCount,
  activeTodosCount,
  filterBy,
  onFilterTodos,
  onClearCompleted,
}) => {
  const filterLinks = Object.values(FilterBy);
  const completedTodosCount = allTodosCount - activeTodosCount;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {filterLinks.map(filterLink => (
          <a
            key={filterLink}
            href={filterLink === FilterBy.All ? '#/' : `#/${filterLink}`}
            className={classNames(
              'filter__link',
              { selected: filterBy === filterLink },
            )}
            onClick={() => onFilterTodos(filterLink)}
          >
            {capitalize(filterLink)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        style={{ opacity: +Boolean(completedTodosCount) }}
        disabled={!completedTodosCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
