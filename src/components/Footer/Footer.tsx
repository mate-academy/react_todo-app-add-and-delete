import React from 'react';
import classNames from 'classnames';
import { FilterTodos } from '../../types/FilterTodos';

type Props = {
  allTodos: number,
  activeTodos: number,
  filterBy: FilterTodos,
  onFilterTodos: (curStatus: FilterTodos) => void,
  onRemoveCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  allTodos,
  activeTodos,
  filterBy,
  onFilterTodos,
  onRemoveCompletedTodos,
}) => {
  const filterLinks = Object.values(FilterTodos);

  const completedTodos = allTodos - activeTodos;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {filterLinks.map(filterLink => (
          <a
            key={filterLink}
            href={filterLink === FilterTodos.ALL ? '#/' : `#/${filterLink}`}
            className={classNames(
              'filter__link',
              { selected: filterBy === filterLink },
            )}
            onClick={() => onFilterTodos(filterLink)}
          >
            {filterLink.charAt(0).toUpperCase() + filterLink.slice(1)}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          opacity: +Boolean(completedTodos),
          cursor: !completedTodos ? 'auto' : 'pointer',
        }}
        disabled={!completedTodos}
        onClick={onRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
