import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

type Proto = {
  todos: Todo[];
  activeTodosCount: number;
  statusFilterTodo: FilterBy;
  setStatusFilterTodo: (filter: FilterBy) => void;
  handleClearTodo: () => void;
};

export const TodoFooter: React.FC<Proto> = ({
  todos,
  activeTodosCount,
  statusFilterTodo,
  setStatusFilterTodo,
  handleClearTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusFilterTodo === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          onClick={event => {
            event.preventDefault();
            setStatusFilterTodo(FilterBy.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusFilterTodo === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={event => {
            event.preventDefault();
            setStatusFilterTodo(FilterBy.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusFilterTodo === FilterBy.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            event.preventDefault();
            setStatusFilterTodo(FilterBy.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearTodo}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
