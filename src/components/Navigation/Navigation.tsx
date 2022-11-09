import classNames from 'classnames';
import { GroupBy } from '../../types/GroupBy';

type Props = {
  groupBy: GroupBy,
  onGroup: (status: GroupBy) => void;
};

export const Navigation: React.FC<Props> = ({ groupBy, onGroup }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames('filter__link', {
        selected: groupBy === GroupBy.ALL,
      })}
      onClick={() => onGroup(GroupBy.ALL)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames('filter__link', {
        selected: groupBy === GroupBy.ACTIVE,
      })}
      onClick={() => onGroup(GroupBy.ACTIVE)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames('filter__link', {
        selected: groupBy === GroupBy.COMPLETED,
      })}
      onClick={() => onGroup(GroupBy.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
