import classNames from 'classnames';
import { SortByStatus } from '../../types/SortByStatus';

type Props = {
  sortBy: SortByStatus,
  numberActiveTodos: number,
  onChangeSortBy: (sortBy: SortByStatus) => void,
  hasCompletedTodo: boolean,
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  sortBy,
  numberActiveTodos,
  onChangeSortBy,
  hasCompletedTodo,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortByStatus.All },
          )}
          onClick={() => onChangeSortBy(SortByStatus.All)}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortByStatus.Active },
          )}
          onClick={() => onChangeSortBy(SortByStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortByStatus.Completed },
          )}
          onClick={() => onChangeSortBy(SortByStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedTodos}
        style={{ visibility: !hasCompletedTodo ? 'hidden' : 'visible' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
