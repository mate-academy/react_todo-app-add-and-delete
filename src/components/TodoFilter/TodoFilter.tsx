import { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';
import { TodoContext } from '../../context/TodoContext';

export const TodoFilter: React.FC = () => {
  const { status, changeStatus } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => changeStatus(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => changeStatus(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => changeStatus(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
