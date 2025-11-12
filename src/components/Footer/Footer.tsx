import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  completedTodos: Todo[];
  status: TodoStatus;
  onHandleStatus: (status: TodoStatus) => void;
  onHandleDeleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  completedTodos,
  status,
  onHandleStatus,
  onHandleDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onHandleStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onHandleStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onHandleStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length <= 0}
        onClick={onHandleDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
