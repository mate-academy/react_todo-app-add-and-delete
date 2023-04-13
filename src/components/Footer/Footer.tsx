import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  numActiveTodos: number;
  numCompletedTodos: number;
  statusFilter: FilterType;
  todos: Todo[];
  clickFilterHandler: (filter: FilterType) => void;
  clearCompletedHandler: () => void;
};

export const Footer: React.FC<Props> = ({
  numActiveTodos,
  numCompletedTodos,
  statusFilter,
  todos,
  clickFilterHandler,
  clearCompletedHandler,
}) => {
  return (
    <footer
      className="todoapp__footer"
      hidden={!todos}
    >
      <span className="todo-count">
        {`${numActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === FilterType.All && 'selected'}`}
          onClick={() => clickFilterHandler(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === FilterType.Active && 'selected'}`}
          onClick={() => clickFilterHandler(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === FilterType.Completed && 'selected'}`}
          onClick={() => clickFilterHandler(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedHandler}
        disabled={!numCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
