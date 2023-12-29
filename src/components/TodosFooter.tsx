import classNames from 'classnames';
import { FC } from 'react';

export type FilterBy = keyof typeof FILTERS;
const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

type Props = {
  filterBy: FilterBy,
  activeTodosLength: number,
  completedTodosLength: number,
  onFilterChange: (filterBy: FilterBy) => void
};

export const TodosFooter: FC<Props> = ({
  filterBy,
  activeTodosLength,
  completedTodosLength,
  onFilterChange,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FILTERS).map(([key, value]) => (
          <a
            key={key}
            href={`#/${key}`}
            className={classNames('filter__link', {
              selected: filterBy === key,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onFilterChange(key as FilterBy)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodosLength <= 0}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
