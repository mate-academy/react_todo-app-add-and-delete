import classNames from 'classnames';
import { SortBy } from '../types/SortBy';

type Footer = {
  onFilterAllTodos: () => void,
  onFilterActiveTodos: () => void,
  onFilterCompletedTodos: () => void,
  onClearCompleted: () => void,
  selectedFilter: SortBy
  activeTodos: number,
};

export const TodoFooter: React.FC<Footer> = ({
  onFilterAllTodos,
  onFilterActiveTodos,
  onFilterCompletedTodos,
  onClearCompleted,
  selectedFilter,
  activeTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.all,
            },
          )}
          onClick={onFilterAllTodos}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.active,
            },
          )}
          onClick={onFilterActiveTodos}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.completed,
            },
          )}
          onClick={onFilterCompletedTodos}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
