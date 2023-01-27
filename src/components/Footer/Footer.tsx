import { FC, memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

interface FooterProps {
  uncompletedTodosLength: number,
  filter: FilterType,
  onChangeFilter: (value: FilterType) => void,
  clearCompletedButton: () => void,
}

export const Footer: FC<FooterProps> = memo(({
  uncompletedTodosLength,
  filter,
  onChangeFilter,
  clearCompletedButton,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.ALL },
          )}
          onClick={() => onChangeFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.ACTIVE },
          )}
          onClick={() => onChangeFilter(FilterType.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === FilterType.COMPLETED },
          )}
          onClick={() => onChangeFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedButton}
      >
        Clear completed
      </button>
    </footer>
  );
});
