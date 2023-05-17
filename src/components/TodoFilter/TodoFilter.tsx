import classNames from 'classnames';
import { FilterBy } from '../../types/TodosFilter';

interface Props {
  filter: string;
  onSetFilter: (filter: FilterBy) => void;
}

export const TodoFilter: React.FC<Props> = ({ filter, onSetFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterBy.ALL,
        })}
        onClick={() => onSetFilter(FilterBy.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterBy.ACTIVE,
        })}
        onClick={() => onSetFilter(FilterBy.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterBy.COMPLETED,
        })}
        onClick={() => onSetFilter(FilterBy.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
