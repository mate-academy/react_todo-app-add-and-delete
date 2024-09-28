import { Todo } from '../types/Todo';
import { TodoStatus } from '../App';

interface FooterProps {
  filter: TodoStatus;
  setFilter: (filter: TodoStatus) => void;
  todos: Todo[];
  onClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  todos,
  onClick,
}) => {
  const activeTodo = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo} {activeTodo === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === TodoStatus.ALL ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodoStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === TodoStatus.ACTIVE ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TodoStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === TodoStatus.COMPLITED ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodoStatus.COMPLITED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClick}
        disabled={completedTodos <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
