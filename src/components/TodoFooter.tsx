import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeTodosAmount: number;
  currentFilter: Filter;
  handleFilterChange: (filter: Filter) => () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosAmount,
  currentFilter,
  handleFilterChange,
}) => {
  const getFilterClass = (linkFilter: Filter) =>
    classNames({
      filter__link: true,
      selected: linkFilter === currentFilter,
    });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={getFilterClass(Filter.All)}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={getFilterClass(Filter.Active)}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={getFilterClass(Filter.Completed)}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

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
