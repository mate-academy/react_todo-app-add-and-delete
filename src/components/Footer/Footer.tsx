import cn from 'classnames';
import { FilterStatus } from '../../types/Filterstatus';
import { Todo } from '../../types/Todo';

type Props = {
  completedTodos: Todo[] | [],
  uncompletedTodosAmount: number,
  setFilterStatus: (str: FilterStatus) => void,
  filterStatus: FilterStatus,
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  uncompletedTodosAmount,
  setFilterStatus,
  filterStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => setFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => setFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => setFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>

      </nav>

      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
