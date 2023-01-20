import { FC } from 'react';
import classNames from 'classnames';
import { FilterState } from '../../types/FilterState';

type Props = {
  activeNumber: number,
  completedNumber: number,
  selectedFilter: FilterState,
  onFilterSelect: (filter: FilterState) => void,
  onClearCompletedClick: () => void,
};

export const TodosFooter: FC<Props> = ({
  activeNumber,
  completedNumber,
  selectedFilter,
  onFilterSelect,
  onClearCompletedClick,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeNumber} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterState.All },
          )}
          onClick={() => onFilterSelect(FilterState.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterState.Active },
          )}
          onClick={() => onFilterSelect(FilterState.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterState.Completed },
          )}
          onClick={() => onFilterSelect(FilterState.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': completedNumber === 0 },
        )}
        onClick={onClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
