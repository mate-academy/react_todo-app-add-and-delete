import { FC } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  todosCount: number;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  deleteCompletedTodos: () => void;
};

export const FilterPanel: FC<Props> = ({
  todosCount,
  filterType,
  setFilterType,
  deleteCompletedTodos,
}) => {
  const {
    ALL,
    COMPLETED,
    ACTIVE,
  } = FilterType;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterType === ALL,
          })}
          onClick={() => setFilterType(ALL)}
        >
          {ALL}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === ACTIVE,
          })}
          onClick={() => setFilterType(ACTIVE)}
        >
          {ACTIVE}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === COMPLETED,
          })}
          onClick={() => setFilterType(COMPLETED)}
        >
          {COMPLETED}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
