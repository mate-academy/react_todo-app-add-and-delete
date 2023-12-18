import cn from 'classnames';
import { useContext } from 'react';
import { FilterBy } from '../../types/FilterBy';
import { AppContext } from '../../contexts/appContext';

export const Footer: React.FC = () => {
  const {
    todosFromServer,
    filterBy,
    setFilterBy,
    clearCompleted,
  } = useContext(AppContext);

  const uncompletedTodosCount = todosFromServer
    .filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          onClick={() => setFilterBy(FilterBy.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          onClick={() => setFilterBy(FilterBy.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Completed,
          })}
          onClick={() => setFilterBy(FilterBy.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={todosFromServer.every(todo => !todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
