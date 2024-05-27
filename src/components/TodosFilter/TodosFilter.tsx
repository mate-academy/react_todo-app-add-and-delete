import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';
import { Status } from '../../types/Status';

export const TodosFilter: React.FC = () => {
  const { filter, setFilter } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(status => (
        <a
          key={status}
          href={status === Status.all ? '#/' : `#/${status.toLowerCase()}`}
          className={cn('filter__link', {
            selected: filter === status,
          })}
          data-cy={`FilterLink${status}`}
          onClick={() => setFilter(status)}
        >
          {status}
        </a>
      ))}
    </nav>
  );
};
