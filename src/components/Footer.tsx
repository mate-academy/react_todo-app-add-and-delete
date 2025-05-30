import classNames from 'classnames';
import { FilterValues, Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterValues.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterValues.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterValues.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
