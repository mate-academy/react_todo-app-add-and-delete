import './style.scss';
import { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { TodosContext } from '../GlobalStateProvier';

export const TodosFilter: React.FC = () => {
  const { filterStatus, setFilterStatus, setError } = useContext(TodosContext);

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
