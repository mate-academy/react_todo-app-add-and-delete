import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  activeFilter: Status,
  setActiveFilter: (value: Status) => void,
};

export const Filter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const isItActiveFilter = (filter: Status) => activeFilter === filter;

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.All),
        })}
        onClick={() => setActiveFilter(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.Active),
        })}
        onClick={() => setActiveFilter(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.Completed),
        })}
        onClick={() => setActiveFilter(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
