import { Filters } from '../../types/Filters';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  currentFilter: Filters;
  todosActive: Todo[];
  todosCompleted: Todo[];
  onFilterChange: (filter: Filters) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  currentFilter,
  todosActive,
  todosCompleted,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosActive.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCompleted.length === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
