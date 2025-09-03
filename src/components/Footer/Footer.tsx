import { Todo } from '../../types/Todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  filterBy: string | null;
  setFilterBy: (filterBy: string | null) => void;
  anyCompleted: boolean;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  anyCompleted,
  clearCompleted,
}) => {
  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterBy === null,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilterBy(null)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filterBy === 'active',
            })}
            data-cy="FilterLinkActive"
            onClick={() => setFilterBy('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterBy === 'completed',
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilterBy('completed')}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          disabled={!anyCompleted}
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
