import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType,
  setFilterType: (filter: FilterType) => void,
  completedTodos: Todo[];
  activeTodos: Todo[];
  removeCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos, filterType, setFilterType, completedTodos, removeCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.All,
            })
          }
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.Active,
            })
          }
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.Completed,
            })
          }
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
