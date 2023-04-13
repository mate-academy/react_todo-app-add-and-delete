import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  numActiveTodos: number;
  numCompletedTodos: number;
  statusFilter: FilterType;
  todos: Todo[];
  handleClickFilter: (filter: FilterType) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  numActiveTodos,
  numCompletedTodos,
  statusFilter,
  todos,
  handleClickFilter,
  handleClearCompleted,
}) => {
  return (
    <footer
      className="todoapp__footer"
      hidden={!todos.length}
    >
      <span className="todo-count">
        {`${numActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === FilterType.All && 'selected'}`}
          onClick={() => handleClickFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === FilterType.Active && 'selected'}`}
          onClick={() => handleClickFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === FilterType.Completed && 'selected'}`}
          onClick={() => handleClickFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
        disabled={!numCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
