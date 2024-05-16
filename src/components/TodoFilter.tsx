import classNames from 'classnames';
import { Status } from '../enums/Status';

type Props = {
  status: Status;
  setStatus: (status: Status) => void;
};

export const TodoFilter: React.FC<Props> = ({ status, setStatus }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href={Status.all}
      className={classNames('filter__link', {
        selected: status === Status.all,
      })}
      data-cy="FilterLinkAll"
      onClick={() => setStatus(Status.all)}
    >
      All
    </a>

    <a
      href={Status.active}
      className={classNames('filter__link', {
        selected: status === Status.active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => setStatus(Status.active)}
    >
      Active
    </a>

    <a
      href={Status.completed}
      className={classNames('filter__link', {
        selected: status === Status.completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => setStatus(Status.completed)}
    >
      Completed
    </a>
  </nav>
);
