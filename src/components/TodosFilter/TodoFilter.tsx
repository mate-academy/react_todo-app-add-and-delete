import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  todosLeft: number,
  todosCompleted: number,
  filterBy: FilterBy,
  setFilterBy: (filter: FilterBy) => void,
  onRemoveCompleted: () => void,
};

export const TodosFilter: React.FC<Props> = React.memo(({
  todosLeft,
  todosCompleted,
  filterBy,
  setFilterBy,
  onRemoveCompleted,
}) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filter: FilterBy,
  ) => {
    event.preventDefault();
    setFilterBy(filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterBy).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames(
              'filter__link',
              { selected: filter === filterBy },
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
        disabled={!todosCompleted}
        onClick={onRemoveCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
