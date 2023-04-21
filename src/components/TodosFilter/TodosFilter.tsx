import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  currentFilter: Filter,
  setCurrentFilter: (filter: Filter) => void,
  itemsLeft: number,
  completedLeft: number,
  onClearCompleted: () => void,
};

export const TodosFilter: React.FC<Props> = React.memo(({
  currentFilter,
  setCurrentFilter,
  itemsLeft,
  completedLeft,
  onClearCompleted,
}) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filter: Filter,
  ) => {
    event.preventDefault();
    setCurrentFilter(filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} item${itemsLeft === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames(
              'filter__link',
              { selected: filter === currentFilter },
            )}
            onClick={(event) => {
              handleFilterChange(event, filter);
            }}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedLeft}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
