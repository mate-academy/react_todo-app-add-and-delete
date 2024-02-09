import classNames from 'classnames';
import { useContext } from 'react';
import { Status } from '../../types/Status';
import { TodosContext } from '../TodosContext';

export const TodosFilter: React.FC = () => {
  const { filterStatus, setFilterStatus } = useContext(TodosContext);

  const handleNewStatus = (status: Status) => {
    setFilterStatus(status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleNewStatus(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleNewStatus(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleNewStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
