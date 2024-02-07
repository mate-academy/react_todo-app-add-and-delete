import { memo } from 'react';
import { Filter } from '../types/enums/filter';

interface Props {
  filterTodos: (filter: Filter) => void,
  isCompletedTodos: boolean,
  activeTodosCount: number,
}

export const Footer: React.FC<Props> = memo(({
  filterTodos,
  isCompletedTodos,
  activeTodosCount,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className="filter__link selected"
        data-cy="FilterLinkAll"
        onClick={() => filterTodos(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className="filter__link"
        data-cy="FilterLinkActive"
        onClick={() => filterTodos(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className="filter__link"
        data-cy="FilterLinkCompleted"
        onClick={() => filterTodos(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    {/* don't show this button if there are no completed todos */}
    {isCompletedTodos && (
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    )}
  </footer>
));
