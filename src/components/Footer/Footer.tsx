import cn from 'classnames';
import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { CompletedFilter } from '../../types/CompletedFilter';

interface Props {
  activeTodos: Todo[],
  completedFilter: CompletedFilter,
  setCompletedFilter: (v: CompletedFilter) => void;
}

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  completedFilter,
  setCompletedFilter,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodos.length} item${activeTodos.length > 1 ? 's' : ''} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: completedFilter === CompletedFilter.All },
        )}
        onClick={() => setCompletedFilter(CompletedFilter.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: completedFilter === CompletedFilter.Active },
        )}
        onClick={() => setCompletedFilter(CompletedFilter.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: completedFilter === CompletedFilter.Completed },
        )}
        onClick={() => setCompletedFilter(CompletedFilter.Completed)}
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
