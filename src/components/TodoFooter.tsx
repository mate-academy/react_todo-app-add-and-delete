import classNames from 'classnames';

import { FilterStatus } from '../types/FilterStatus';

type Props = {
  countActiveTodos: number,
  hasCompletedTodos: boolean,
  filter: FilterStatus,
  onFilterChange: (filter: FilterStatus) => void,
};

export const TodoFooter: React.FC<Props> = ({
  countActiveTodos, hasCompletedTodos, filter, onFilterChange,
}) => {
  return (
    /* Hide the footer if there are no todos */
    <footer
      className="todoapp__footer"
    >
      <span className="todo-count">
        {`${countActiveTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.ALL,
          })}
          onClick={() => onFilterChange(FilterStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.ACTIVE,
          })}
          onClick={() => onFilterChange(FilterStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.COMPLETED,
          })}
          onClick={() => onFilterChange(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
