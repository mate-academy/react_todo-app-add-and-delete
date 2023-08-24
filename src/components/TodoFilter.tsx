import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  setStatus: (text: string) => void,
  status: string,
};

export const TodoFilter: React.FC<Props> = ({
  setStatus,
  status,
}) => {
  const handleFilter = (filter: Status) => () => {
    setStatus(filter);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === Status.ALL,
        })}
        onClick={handleFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === Status.ACTIVE,
        })}
        onClick={handleFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === Status.COMPLETED,
        })}
        onClick={handleFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
