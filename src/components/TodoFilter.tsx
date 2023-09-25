import classNames from 'classnames';
import { StatusFilter } from '../types/StatusFilter';

type Props = {
  status: StatusFilter,
  handleStatusChange: (status: StatusFilter) => void,
  countActiveTodos: number,
  countCompletedTodos: number,
  handleClearCompleted: () => void,
};

export const TodoFilter: React.FC<Props> = ({
  status,
  handleStatusChange,
  countActiveTodos,
  countCompletedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: status === StatusFilter.All })}
          data-cy="FilterLinkAll"
          onClick={() => handleStatusChange(StatusFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: status === StatusFilter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => handleStatusChange(StatusFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: status === StatusFilter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleStatusChange(StatusFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!countCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
