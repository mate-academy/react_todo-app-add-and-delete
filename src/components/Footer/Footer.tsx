import classNames from 'classnames';
import { useTodos } from '../../Store';
import { Status } from '../../types/FilterStatus';

export const Footer = () => {
  const { todos, filterStatus, setFilterStatus } = useTodos();

  const remainingTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {remainingTodos} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterStatus === Status.All,
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilterStatus(Status.All)}
            >
              {Status.All}
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterStatus === Status.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilterStatus(Status.Active)}
            >
              {Status.Active}
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterStatus === Status.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilterStatus(Status.Completed)}
            >
              {Status.Completed}
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!hasCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
