import classNames from 'classnames';
import { FilterOption } from '../types/FilterOption';

type Props = {
  itemsLeft: number;
  filterOption: FilterOption;
  disabled: boolean;
  setFilterOption: (value: FilterOption) => void;
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filterOption,
  disabled,
  setFilterOption,
  deleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterOption === FilterOption.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterOption(FilterOption.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterOption === FilterOption.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterOption(FilterOption.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterOption === FilterOption.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterOption(FilterOption.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={disabled}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
