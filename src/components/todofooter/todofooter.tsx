import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';

export const TodoFooter = () => {
  const {
    filterBy, setFilterBy, countIncompleteTask, todos,
  } = useTodos();

  const hiddenBtn = todos.filter(el => el.completed).length === 0;

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {countIncompleteTask}
            {' '}
            items left
          </span>

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

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={hiddenBtn}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
