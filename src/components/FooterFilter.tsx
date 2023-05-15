import cn from 'classnames';
import { useTodoContext } from '../context/TodoContext';
import { Filter } from '../types/Filter';

export const FooterFilter: React.FC = () => {
  const { todos, filter, setFilter } = useTodoContext();

  return (
    <>
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.ALL,
          })}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.ACTIVE,
          })}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.COMPLETED,
          })}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {todos.some((todo) => todo.completed) && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </>
  );
};
