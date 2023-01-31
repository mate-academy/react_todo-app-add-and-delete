import cn from 'classnames';
import { memo } from 'react';
import { FilterType } from '../../types/FilterType';

interface FooterProps {
  activeTodosCount: number,
  completedFilter: string,
  setCompletedFilter: (str: FilterType) => void,
}

export const Footer: React.FC<FooterProps> = memo(({
  activeTodosCount: countActiveTodos,
  completedFilter: selectedFilterForTodos,
  setCompletedFilter: onChosedFilter,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${countActiveTodos} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilterForTodos === FilterType.All,
        })}
        onClick={() => onChosedFilter(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilterForTodos === FilterType.Active,
        })}
        onClick={() => onChosedFilter(FilterType.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilterForTodos === FilterType.Completed,
        })}
        onClick={() => onChosedFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
));
