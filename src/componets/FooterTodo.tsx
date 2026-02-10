import cn from 'classnames';
import { TodoFilter } from '../types/TodoFilter';

type Props = {
  activeCount: number;
  filter: TodoFilter;
  hasCompleted: boolean;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
};

export const FooterTodo: React.FC<Props> = ({
  activeCount,
  filter,
  hasCompleted,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
