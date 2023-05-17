import classNames from 'classnames';
import { Status } from '../../types/TodoFilter';

type Props = {
  filterBy: Status;
  onFilterChange: (filter: Status) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterBy,
  onFilterChange,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filterBy === Status.All,
      })}
      onClick={() => onFilterChange(Status.All)}
    >
      {Status.All}
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filterBy === Status.Active,
      })}
      onClick={() => onFilterChange(Status.Active)}
    >
      {Status.Active}
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filterBy === Status.Completed,
      })}
      onClick={() => onFilterChange(Status.Completed)}
    >
      {Status.Completed}
    </a>
  </nav>
);
