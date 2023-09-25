import classNames from 'classnames';
import { FilterCase } from '../../types/FilterCase';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterCase: FilterCase;
  setFilterCase: (filterCase: FilterCase) => void;
  activeTodos: Todo[];
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterCase,
  setFilterCase,
  activeTodos,
  handleClearCompleted,
}) => {
  const completedTodos = todos.filter(({ completed }) => completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterCase === FilterCase.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterCase(FilterCase.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterCase === FilterCase.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterCase(FilterCase.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterCase === FilterCase.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterCase(FilterCase.completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
