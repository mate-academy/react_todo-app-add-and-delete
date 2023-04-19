import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filter: FilterStatus,
  onFilterChange: (filter: FilterStatus) => void,
};

export const FilterForTodos: React.FC<Props> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterStatus.All },
          )
        }
        onClick={() => {
          onFilterChange(FilterStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterStatus.Active },
          )
        }
        onClick={() => {
          onFilterChange(FilterStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterStatus.Completed },
          )
        }
        onClick={() => {
          onFilterChange(FilterStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
