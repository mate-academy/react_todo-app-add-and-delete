import classNames from 'classnames';
import { TodosFilter } from '../../types/TodoFilter';

type Props = {
  filter: TodosFilter,
  setFilter: (filter: TodosFilter) => void,
  activeTodosCount: number,
  completedTodosCount: boolean,
  handleClearCompleted: () => void;
};
export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodosCount,
  completedTodosCount,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodosFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TodosFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodosFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCount}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
