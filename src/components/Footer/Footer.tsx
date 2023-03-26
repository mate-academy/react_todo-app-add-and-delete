import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType,
  setFilterType: (filter: FilterType) => void,
  completedTodos: Todo[];
  activeTodos: Todo[];
  removeCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos, filterType, setFilterType, completedTodos, removeCompletedTodos,
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
      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': !completedTodos.length })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
