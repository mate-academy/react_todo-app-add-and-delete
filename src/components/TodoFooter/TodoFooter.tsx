import { FilterStatus } from '../../types/enums';
import cn from 'classnames';

interface Props {
  undoneTodosCount: number;
  filterStatus: FilterStatus;
  isAllTodosUncompleted: boolean;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

const TodoFooter = ({
  undoneTodosCount,
  filterStatus,
  isAllTodosUncompleted,
  onFilterChange,
  onClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${undoneTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={isAllTodosUncompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
