import { FC } from 'react';
import cn from 'classnames';

import { FILTERS } from '../constants';
import { FilterType } from '../types';

type Props = {
  onAddFilter: (filter: FilterType) => void;
  filter: FilterType;
  activeTodos: number;
  areAllActive: boolean;
  onDeleteCompletedTodos: () => void;
};

export const Footer: FC<Props> = ({
  filter,
  onAddFilter,
  activeTodos,
  areAllActive,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(filterItem => (
          <a
            href={`#/${filterItem.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterItem === filter,
            })}
            data-cy={`FilterLink${filterItem}`}
            key={filterItem}
            onClick={() => onAddFilter(filterItem)}
          >
            {filterItem}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={areAllActive}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
