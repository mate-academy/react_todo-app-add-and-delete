import { useContext } from 'react';
import classNames from 'classnames';
import { filterOptions } from '../constants/filterOptions';
import { TodosContext } from '../context/TodosContext';

export const TodoFilter = () => {
  const { filter, setFilter } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(({ label, status }) => (
        <a
          key={status}
          href={`#/${status.toLowerCase()}`}
          className={classNames(
            'filter__link', {
              selected: filter === status,
            },
          )}
          data-cy={`FilterLink${status}`}
          onClick={() => setFilter(status)}
        >
          {label}
        </a>

      ))}
    </nav>
  );
};
