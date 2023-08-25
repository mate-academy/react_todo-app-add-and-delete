import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Filter } from '../../types/Filter';

export const TodosFilter: React.FC = () => {
  const { filter, setFilter } = useContext(TodosContext);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: !filter,
        })}
        onClick={() => setFilter(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === Filter.Active,
        })}
        onClick={() => setFilter(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.Completed,
        })}
        onClick={() => setFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
