import { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { TodosContext } from './TodosContext';

// type Props = {
//   status: Status
//   setStatus: (val: Status) => void
// };

export const TodosFilters: React.FC = () => {
  const { status, setStatus } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: status === 'all' })}
        data-cy="FilterLinkAll"
        onClick={(e) => {
          e.preventDefault();
          setStatus(Status.all);
        }}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: status === 'active' })}
        data-cy="FilterLinkActive"
        onClick={(e) => {
          e.preventDefault();
          setStatus(Status.active);
        }}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: status === 'completed' })}
        data-cy="FilterLinkCompleted"
        onClick={(e) => {
          e.preventDefault();
          setStatus(Status.completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
