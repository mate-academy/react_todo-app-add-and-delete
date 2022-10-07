import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { Props } from './Filters.props';

export const Filters: FC<Props> = ({
  todos,
  setFilterBy,
  filterBy,
  deleteCompletedTodos,
}) => {
  const uncompletedTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {uncompletedTodos.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          onClick={() => setFilterBy(FilterStatus.All)}
          className={classNames('filter__link', {
            selected: filterBy === FilterStatus.All,
          })}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          onClick={() => setFilterBy(FilterStatus.Active)}
          className={classNames('filter__link', {
            selected: filterBy === FilterStatus.Active,
          })}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          onClick={() => setFilterBy(FilterStatus.Completed)}
          className={classNames('filter__link', {
            selected: filterBy === FilterStatus.Completed,
          })}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={deleteCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
