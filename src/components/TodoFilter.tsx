import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  handleFilterStatus: (status: Status) => void,
  todosFilterStatus: Status
};

export const TodoFilter: React.FC<Props> = ({
  handleFilterStatus,
  todosFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.All,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.Active,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.Completed,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(Status.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
