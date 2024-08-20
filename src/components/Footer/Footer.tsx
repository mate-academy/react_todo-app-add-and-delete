import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  notCompletedTodos: number;
  onFilterChange: (currentFilter: Filter) => void;
  currentFilter: Filter;
};

export const Footer: React.FC<Props> = ({
  notCompletedTodos,
  onFilterChange,
  currentFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="currentFilter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            if (currentFilter !== Filter.All) {
              onFilterChange(Filter.All);
            }
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            if (currentFilter !== Filter.Active) {
              onFilterChange(Filter.Active);
            }
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            if (currentFilter !== Filter.Completed) {
              onFilterChange(Filter.Completed);
            }
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
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
