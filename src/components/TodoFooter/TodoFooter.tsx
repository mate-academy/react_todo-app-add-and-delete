import cn from 'classnames';
import { FilterStatus } from '../../types/filterStatus';

type Props = {
  filterCompleted: FilterStatus;
  onCompleted: (filter: FilterStatus) => void;
  activeTodosCount: number;
  onDeleteAllTodos: () => Promise<void>;
  completedTodos: number;
};

export function TodoFooter({
  filterCompleted,
  onCompleted,
  activeTodosCount,
  onDeleteAllTodos,
  completedTodos,
}: Props) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterCompleted === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onCompleted(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterCompleted === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onCompleted(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterCompleted === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onCompleted(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAllTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
}
