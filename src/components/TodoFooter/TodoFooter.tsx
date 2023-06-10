import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

interface TodoFooterProps {
  remainingTodos: number;
  filter: string;
  setFilter: (filter: string) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = (
  {
    remainingTodos,
    filter,
    setFilter,
    hasCompletedTodos,
    onClearCompleted,
  },
) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {remainingTodos}
      {' items left'}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterType.ALL },
          )
        }
        onClick={() => setFilter(FilterType.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterType.ACTIVE },
          )
        }
        onClick={() => setFilter(FilterType.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            'filter__link',
            { selected: filter === FilterType.COMPLETED },
          )
        }
        onClick={() => setFilter(FilterType.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
