import { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext/TodoContext';
import { Status } from '../../types/Status';

export const TodosFilter: React.FC = () => {
  const { filter, setFilter } = useContext(TodoContext);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          { selected: filter === Status.all },
        )}
        onClick={() => setFilter(Status.all)}
      >
        {Status.all}
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filter === Status.active },
        )}
        onClick={() => setFilter(Status.active)}
      >
        {Status.active}
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filter === Status.completed },
        )}
        onClick={() => setFilter(Status.completed)}
      >
        {Status.completed}
      </a>
    </nav>
  );
};

/* Active filter should have a 'selected' class */
