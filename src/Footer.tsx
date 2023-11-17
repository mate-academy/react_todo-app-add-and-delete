import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Status } from './types/Status';

type Props = {
  todos: Todo[];
  clearCompletedTodos: () => void;
  setFilter: (newStatus: Status) => void;
  currentFilter: Status;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  setFilter,
  clearCompletedTodos,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  const itemsLeft = activeTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>
      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
