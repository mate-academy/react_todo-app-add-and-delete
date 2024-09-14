import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  activeFilter: TodoStatus;
  setActiveFilter: (state: TodoStatus) => void;
  onClearCompleted: () => void;
};

export const Footer = ({
  activeTodosCount,
  completedTodosCount,
  activeFilter,
  setActiveFilter,
  onClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: activeFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setActiveFilter(status)}
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
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
