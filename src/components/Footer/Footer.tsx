import classNames from 'classnames';
import { FilterType } from '../../helpers/filterTodos';

interface Props {
  activeTodosCount: number;
  hasCompletedTodo: boolean;
  filterType: FilterType;
  deleteAllCompleted: () => void;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodo,
  filterType,
  deleteAllCompleted,
  setFilter,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.None },
          )}
          onClick={() => setFilter(FilterType.None)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => setFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => setFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          opacity: hasCompletedTodo
            ? 1
            : 0,
        }}
        disabled={!hasCompletedTodo}
        onClick={() => {
          deleteAllCompleted();
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
