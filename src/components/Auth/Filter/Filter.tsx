import classNames from 'classnames';
import { Status } from '../../../types/Status'

type Props = {
  status: Status,
  onStatusChange: (status: Status) => void,
};

export const Filter: React.FC<Props> = (props) => {
  const { status, onStatusChange } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: status === Status.All,
          },
        )}
        onClick={() => onStatusChange(Status.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: status === Status.Active,
          },
        )}
        onClick={() => onStatusChange(Status.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: status === Status.Completed,
          },
        )}
        onClick={() => onStatusChange(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  )
}