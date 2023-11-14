import cn from 'classnames';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

type Props = {
  todos: Todo[],
  clearCompletedTodos: () => void,
  setFilter: (newStatus: Status) => void,
  currentFilter: Status,
};

export const Footer: React.FC<Props> = ({
  todos,
  clearCompletedTodos,
  setFilter = () => {},
  currentFilter = () => {},
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
          className={cn('filter__link', {
            selected: currentFilter === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter(Status.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter(Status.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter(Status.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodos.length > 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
          disabled
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
