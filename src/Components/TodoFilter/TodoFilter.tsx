import classNames from 'classnames';
import { FilterBy } from '../../utils/FilterBy';

type Props = {
  filterBy: FilterBy;
  onFilterChange: (filter: FilterBy) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterBy,
  onFilterChange,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.All,
      })}
      onClick={() => onFilterChange(FilterBy.All)}
    >
      {FilterBy.All}
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.Active,
      })}
      onClick={() => onFilterChange(FilterBy.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filterBy === FilterBy.Completed,
      })}
      onClick={() => onFilterChange(FilterBy.Completed)}
    >
      Completed
    </a>
  </nav>
);
