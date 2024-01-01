import { FC } from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';

export const Footer: FC = () => {
  const {
    todos, selectedFilter, handleFilterChange,
  } = useAppContext();

  const activeTodosNum = todos.reduce((acc, curr) => {
    return !curr.completed
      ? acc + 1
      : acc;
  }, 0);

  const completedTodosNum = todos.length - activeTodosNum;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        { `${activeTodosNum} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          id="All"
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange}
        >
          All
        </a>

        <a
          id="Active"
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange}
        >
          Active
        </a>

        <a
          id="Completed"
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosNum <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
