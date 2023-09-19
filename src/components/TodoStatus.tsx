import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  status: Status,
  onStatusChange: (filter: Status) => void,
};

export const TodoStatus: React.FC<Props> = ({ status, onStatusChange }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === Status.All,
        })}
        onClick={() => onStatusChange(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === Status.Active,
        })}
        onClick={() => onStatusChange(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === Status.Completed,
        })}
        onClick={() => onStatusChange(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
