import { FC } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

interface Props {
  onFilter: (filter: Filter) => void;
  onClear: () => void;
  selectedFilter: Filter;
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
  const filters = [Filter.All, Filter.Active, Filter.Completed];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount.active} items left
      </span>

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
