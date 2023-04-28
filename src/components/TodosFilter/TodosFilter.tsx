import classNames from 'classnames';
import { Statuses } from '../../types/Common';

interface Props {
  status: Statuses;
  onStatusChange: (status: Statuses) => void;
}

export const TodosFilter: React.FC<Props> = ({ status, onStatusChange }) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: status === Statuses.ALL,
      })}
      onClick={() => onStatusChange(Statuses.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: status === Statuses.ACTIVE,
      })}
      onClick={() => onStatusChange(Statuses.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: status === Statuses.COMPLETED,
      })}
      onClick={() => onStatusChange(Statuses.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
