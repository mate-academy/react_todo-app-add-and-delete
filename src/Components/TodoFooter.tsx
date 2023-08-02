import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface Props {
  filterType: Filter;
  setFilterType: (type: Filter) => void;
  completedTodosCount: number,
  uncompletedTodosCount: number,
  deleteCompletedTodos: () => void,
}

export const TodoFooter: React.FC<Props> = ({
  filterType,
  setFilterType,
  completedTodosCount,
  uncompletedTodosCount,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === Filter.All,
          })}
          onClick={() => setFilterType(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filter.Active,
          })}
          onClick={() => setFilterType(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          onClick={() => setFilterType(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedTodosCount === 0,
        })}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
