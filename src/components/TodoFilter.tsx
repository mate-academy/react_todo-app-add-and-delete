import { useContext } from 'react';
import { Status } from '../types/Status';

import { TodoContext } from './TodosContext';
import { TodoContextProps } from '../types/TodoContextProps';

interface PropsFilter {
  filter: Status;
  setFilter: (filter: Status) => void;
}

export const TodosFilter: React.FC<PropsFilter> = () => {
  const todoContext = useContext<TodoContextProps>(TodoContext);

  const filter = todoContext?.filter || Status.ALL;
  const setFilter = todoContext?.setFilter || (() => {});

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={filter === Status.ALL
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={filter === Status.ACTIVE
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={filter === Status.COMPLETED
          ? 'filter__link selected'
          : 'filter__link'}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
