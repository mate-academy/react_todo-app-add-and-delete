import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';

export const TodoFooter = () => {
  const { filterBy, setFilterBy, count } = useTodos();

  return (
    // Hide the footer if there are no todos
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy('all')}
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

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
