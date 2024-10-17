import { FC } from 'react';
import cn from 'classnames';

import { FilterBy } from '../../types/FilterBy';

interface Props {
  selectedFilter: FilterBy;
  completedTodosId: number[];
  numberOfActiveTodos: number;
  setSelectedFilter: (filter: FilterBy) => void;
  setIdsForDelete: (ids: number[]) => void;
}

const Footer: FC<Props> = ({
  selectedFilter,
  completedTodosId,
  numberOfActiveTodos,
  setSelectedFilter,
  setIdsForDelete,
}) => {
  const filters = Object.values(FilterBy);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {numberOfActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter}
            href="#/"
            className={cn('filter__link', {
              selected: filter === selectedFilter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => setIdsForDelete(completedTodosId)}
        disabled={!completedTodosId.length}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
