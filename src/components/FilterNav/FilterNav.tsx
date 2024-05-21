import cn from 'classnames';
import { useContext } from 'react';
import { DispatchContex, StateContex } from '../../Store';
import { Filter } from '../../types/Filter';

export const FilterNav = () => {
  const { filter } = useContext(StateContex);
  const dispatch = useContext(DispatchContex);

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(status => {
        return (
          <a
            key={status}
            href={`#/${status === Filter.ALL ? '' : status.toLowerCase()}`}
            className={cn('filter__link', { selected: filter === status })}
            data-cy={`FilterLink${status}`}
            onClick={() => dispatch({ type: 'set-filter', payload: status })}
          >
            {status}
          </a>
        );
      })}
    </nav>
  );
};
