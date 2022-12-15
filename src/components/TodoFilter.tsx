import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  status: Status;
  onChangeStatus: React.Dispatch<React.SetStateAction<Status>>;
};

export const TodoFilter: React.FC<Props> = ({ status, onChangeStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link', {
            selected: status === Status.All,
          },
        )}
        onClick={() => onChangeStatus(Status.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: status === Status.Active },
        )}
        onClick={() => onChangeStatus(Status.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: status === Status.Completed },
        )}
        onClick={() => onChangeStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>

  );
};
