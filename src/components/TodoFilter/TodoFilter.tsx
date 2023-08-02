import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  sortField: Status,
  setSortField: (status: Status) => void,
};

export const TodoFilter: React.FC<Props> = ({
  sortField,
  setSortField,
}) => (
  <>
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: sortField === Status.All,
        })}
        onClick={() => setSortField(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: sortField === Status.Active,
        })}
        onClick={() => setSortField(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: sortField === Status.Completed,
        })}
        onClick={() => setSortField(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  </>
);
