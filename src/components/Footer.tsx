import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = (
  {
    setFilter,
    filter,
    activeCount,
    clearCompleted,
  },
) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filter === Filter.all,
            },
          )}
          onClick={() => setFilter(Filter.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filter === Filter.active,
            },
          )}
          onClick={() => setFilter(Filter.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filter === Filter.completed,
            },
          )}
          onClick={() => setFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
