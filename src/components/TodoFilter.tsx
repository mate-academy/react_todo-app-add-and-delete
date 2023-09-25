import classNames from 'classnames';

import { Status } from '../types';

type Props = {
  value: Status;
  onValueChange: (value: Status) => void;
};

export const TodoFilter: React.FC<Props> = ({ value, onValueChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      data-cy="FilterLinkAll"
      className={classNames('filter__link', {
        selected: value === Status.All,
      })}
      onClick={() => onValueChange(Status.All)}
    >
      {Status.All}
    </a>

    <a
      href="#/active"
      data-cy="FilterLinkActive"
      className={classNames('filter__link', {
        selected: value === Status.Active,
      })}
      onClick={() => onValueChange(Status.Active)}
    >
      {Status.Active}
    </a>

    <a
      href="#/completed"
      data-cy="FilterLinkCompleted"
      className={classNames('filter__link', {
        selected: value === Status.Completed,
      })}
      onClick={() => onValueChange(Status.Completed)}
    >
      {Status.Completed}
    </a>
  </nav>
);
