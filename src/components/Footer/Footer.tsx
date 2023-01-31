import cn from 'classnames';
import { memo } from 'react';
import { FilterType } from '../../types/FilterType';

interface FooterProps {
  activeTodosCount: number,
  completedFilter: string,
  setCompletedFilter: (str: FilterType) => void,
  deleteCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = memo(({
  activeTodosCount,
  completedFilter,
  setCompletedFilter,
  deleteCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', {
          selected: completedFilter === FilterType.All,
        })}
        onClick={() => setCompletedFilter(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: completedFilter === FilterType.Active,
        })}
        onClick={() => setCompletedFilter(FilterType.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: completedFilter === FilterType.Completed,
        })}
        onClick={() => setCompletedFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={deleteCompleted}
    >
      Clear completed
    </button>
  </footer>
));
