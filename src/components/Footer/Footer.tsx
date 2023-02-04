import cn from 'classnames';
import { FilterBy } from '../../types/filterBy';

type Props = {
  filterBy: FilterBy;
  setFilterBy: (status: FilterBy) => void;
};

export const Footer: React.FC<Props> = ({ setFilterBy, filterBy }) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        4 items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: filterBy === FilterBy.All,
            },
          )}
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: filterBy === FilterBy.Active,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: filterBy === FilterBy.Completed,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
