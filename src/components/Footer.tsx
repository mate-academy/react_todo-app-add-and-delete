import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

type Props = {
  uncompletedTodos: Todo[];
  filterType: FilterTypes;
  handleFilterType: (filterType: FilterTypes) => void;
  handleClearCompleted: () => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  uncompletedTodos,
  filterType,
  handleFilterType,
  handleClearCompleted,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos?.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterType === FilterTypes.ALL ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterType(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterType === FilterTypes.ACTIVE ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterType(FilterTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterType === FilterTypes.COMPLETED ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterType(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos?.every(todo => todo.completed !== true)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
