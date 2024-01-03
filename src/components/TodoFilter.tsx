import classNames from 'classnames';
import { useTodoContext } from '../context';

export const TodoFilter = () => {
  const {
    activeFilter,
    handleTodosFilter,
  } = useTodoContext();

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: activeFilter === 'All',
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleTodosFilter('All')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: activeFilter === 'Active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleTodosFilter('Active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: activeFilter === 'Completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleTodosFilter('Completed')}
      >
        Completed
      </a>
    </nav>
  );
};
