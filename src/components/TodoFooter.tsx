import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filter: FilterStatus;
  countActiveTodos: number;
  hasCompletedTodos: boolean;
  handleFilterChange: (filter: FilterStatus) => void;
  handleDeleteCompletedTodo: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filter,
  countActiveTodos,
  hasCompletedTodos,
  handleFilterChange,
  handleDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${countActiveTodos} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.ALL,
          })}
          onClick={() => handleFilterChange(FilterStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.ACTIVE,
          })}
          onClick={() => handleFilterChange(FilterStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.COMPLETED,
          })}
          onClick={() => handleFilterChange(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleDeleteCompletedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
