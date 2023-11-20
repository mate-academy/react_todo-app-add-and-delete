import './style.scss';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { Errors } from '../../types/Errors';

type Props = {
  filterStatus: Status,
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>
};

export const TodosFilter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  setError,
}) => {
  const handleClick = (status: Status) => {
    setFilterStatus(status);
    setError(null);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn({
          filter__link: true,
          selected: filterStatus === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleClick(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn({
          filter__link: true,
          selected: filterStatus === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleClick(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn({
          filter__link: true,
          selected: filterStatus === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleClick(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
