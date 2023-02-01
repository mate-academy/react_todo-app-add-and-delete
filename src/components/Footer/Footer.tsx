import { FC, memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

interface FooterProps {
  uncompletedTodosLength: number,
  completedTodosLength: number,
  filter: FilterType,
  setFilter: (value: FilterType) => void,
  clearCompletedButton: () => void,
}

export const Footer: FC<FooterProps> = memo(({
  uncompletedTodosLength,
  completedTodosLength,
  filter,
  setFilter,
  clearCompletedButton,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => setFilter(FilterType.ALL)}
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.ALL },
          )}
        >
          All
        </a>

        <a
          onClick={() => setFilter(FilterType.ACTIVE)}
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.ACTIVE },
          )}
        >
          Active
        </a>
        <a
          onClick={() => setFilter(FilterType.COMPLETED)}
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.COMPLETED },
          )}
        >
          Completed
        </a>
      </nav>

      <button
        style={{
          visibility: !completedTodosLength ? 'hidden' : 'visible',
        }}
        data-cy="ClearCompletedButton"
        type="button"
        className="hidden todoapp__clear-completed"
        onClick={clearCompletedButton}
      >
        Clear completed
      </button>

    </footer>
  );
});
