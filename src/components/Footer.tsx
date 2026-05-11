import { Todo } from '../types/Todo';
import { StatusType } from '../types/Status';

type FooterProps = {
  todos: Todo[];
  status: StatusType;
  onFilterChange: (status: StatusType) => void;
  isClearing: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  status,
  onFilterChange,
  isClearing,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === StatusType.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusType.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === StatusType.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusType.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === StatusType.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusType.Completed);
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
        disabled={completedTodos.length === 0 || isClearing}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
