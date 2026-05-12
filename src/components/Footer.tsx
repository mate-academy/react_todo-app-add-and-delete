import { Todo } from '../types/Todo';
import { StatusType } from '../types/Status';
import { filters } from '../types/filters';

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

  const handleFilterClick =
    (newStatus: StatusType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onFilterChange(newStatus);
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            className={`filter__link ${status === filter.status ? 'selected' : ''}`}
            data-cy={`FilterLink${filter.label}`}
            onClick={handleFilterClick(filter.status)}
          >
            {filter.label}
          </a>
        ))}
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
