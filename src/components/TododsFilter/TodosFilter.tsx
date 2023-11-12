import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  status: string;
  setStatus: (st: string) => void;
};

export const TodosFilter: React.FC<Props> = ({
  status,
  setStatus = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: status === Filter.All },
        )}
        data-cy="FilterLinkAll"
        onClick={() => setStatus(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: status === Filter.Active },
        )}
        data-cy="FilterLinkActive"
        onClick={() => setStatus(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: status === Filter.Completed },
        )}
        data-cy="FilterLinkCompleted"
        onClick={() => setStatus(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
