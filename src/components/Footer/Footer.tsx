import classNames from 'classnames';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

type FooterProps = {
  selectedFilter: TodoStatusFilter;
  setSelectedFilter: (state: TodoStatusFilter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
};

export const Footer: React.FC<FooterProps> = ({
  selectedFilter,
  setSelectedFilter,
  activeTodosCount,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatusFilter).map(status => (
          <a
            key={status}
            href="#/"
            className={classNames('filter__link', {
              selected: selectedFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setSelectedFilter(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
