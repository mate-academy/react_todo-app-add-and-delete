import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
};

export const FilterTodo: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterStatus.all,
        })}
        onClick={() => {
          onFilterChange(FilterStatus.all);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterStatus.active,
        })}
        onClick={() => {
          onFilterChange(FilterStatus.active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterStatus.completed,
        })}
        onClick={() => {
          onFilterChange(FilterStatus.completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
