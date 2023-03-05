import classNames from 'classnames';
// eslint-disable-next-line import/no-cycle
import { SortType } from '../../App';

type Props = {
  noCompleteTodos: boolean,
  filterBy: SortType,
  setFilterBy: (value: SortType) => void,
  clearCompleted: () => void,
  leftTodos: number,
};

export const Footer: React.FC<Props> = ({
  noCompleteTodos,
  filterBy,
  setFilterBy,
  clearCompleted,
  leftTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.ALL },
          )}
          onClick={() => setFilterBy(SortType.ALL)}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.ACTIVE },
          )}
          onClick={() => setFilterBy(SortType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === SortType.COMPLETED },
          )}
          onClick={() => setFilterBy(SortType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed_none': !noCompleteTodos },

        )}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
