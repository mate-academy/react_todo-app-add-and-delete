import classNames from 'classnames';
import { FilterType, FILTERS } from '../types/FilterType';

type Props = {
  activeCount: number;
  filter: FilterType;
  hasCompleted: boolean;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  hasCompleted,
  setFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: filter === FILTERS.all,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.all);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: filter === FILTERS.active,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: filter === FILTERS.completed,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.completed);
        }}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!hasCompleted}
      data-cy="ClearCompletedButton"
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
