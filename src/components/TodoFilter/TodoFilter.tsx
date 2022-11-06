import classNames from 'classnames';
import { FilterValues } from '../../types/FilterValues';

interface Props {
  selectedFilter:FilterValues;
  onSelection: (filter:FilterValues) => void;
  clearCompleted: () => void;
  completed: number;
}

export const TodoFilter: React.FC<Props> = ({
  selectedFilter,
  onSelection,
  clearCompleted,
  completed,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      4 items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterValues.All,
        })}
        onClick={() => onSelection(FilterValues.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterValues.Active,
        })}
        onClick={() => onSelection(FilterValues.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === FilterValues.Completed,
        })}
        onClick={() => onSelection(FilterValues.Completed)}
      >
        Completed
      </a>
    </nav>
    {completed > 0 && (
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    )}
  </footer>
);
