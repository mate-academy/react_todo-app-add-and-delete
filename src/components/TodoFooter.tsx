import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  todos: Todo[];
  filter: TodoStatus;
  setFilter: (filter: TodoStatus) => void;
  onDelete: (todoIds: number[]) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onDelete,
}) => {
  const todosCounter = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.filter(todo => todo.completed);

  function handleDelete() {
    const todosCompletedId = hasCompleted.map(todo => todo.id);

    onDelete(todosCompletedId);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted.length}
        onClick={handleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
