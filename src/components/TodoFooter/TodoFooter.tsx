import './TodoFooter.scss';
import { FilterTypes } from '../../types/FilterTypes';
import { clsx } from 'clsx';
import { Filter } from '../../enums/Filter';

interface Props {
  activeTodos: number;
  filterType: FilterTypes;
  onFilterTypeChange: (type: Filter) => void;
  hasCompletedTodos: boolean;
  handleClearCompleted: () => void;
}

export const TodoFooter = ({
  activeTodos,
  filterType,
  onFilterTypeChange,
  hasCompletedTodos,
  handleClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={clsx('filter__link', {
            selected: filterType === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterTypeChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={clsx('filter__link', {
            selected: filterType === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterTypeChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={clsx('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterTypeChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
