import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filterStatus: Filter;
  setFilterStatus: (param: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
}) => {
  const handleFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const text = event.currentTarget.textContent;

    switch (text) {
      case Filter.Active:
        setFilterStatus(Filter.Active);
        break;

      case Filter.Completed:
        setFilterStatus(Filter.Completed);
        break;

      default:
        setFilterStatus(Filter.All);
    }
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterStatus === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={handleFilter}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterStatus === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={handleFilter}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleFilter}
      >
        Completed
      </a>
    </nav>
  );
};
