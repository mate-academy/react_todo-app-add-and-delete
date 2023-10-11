import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  currentFilter: string,
  onFilterChange?: (filter: string) => void
};

export const TodosFilter: React.FC<Props> = ({
  currentFilter,
  onFilterChange = () => { },
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          onFilterChange(Filter.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          onFilterChange(Filter.ACTIVE);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          onFilterChange(Filter.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
