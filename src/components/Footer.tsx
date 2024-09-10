import { FC } from 'react';
import { FilterTupes } from '../types/Filters';
import cn from 'classnames';

interface Props {
  onFilter: (filter: FilterTupes) => void;
  onClear: () => void;
  selectedFilter: FilterTupes;
  todosCount: {
    active: number;
    completed: number;
  };
}

export const Footer: FC<Props> = ({
  onFilter,
  onClear,
  todosCount,
  selectedFilter,
}) => {
  const filters = [FilterTupes.All, FilterTupes.Active, FilterTupes.Completed];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount.active} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter}
            href={`#${filter}`}
            className={cn('filter__link', {
              selected: filter === selectedFilter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCount.completed === 0}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
