import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (filterBy: Status) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  onClearCompleted,
}) => {
  const isActiveTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const handleFilterChange = (status: Status) => {
    setSelectedFilter(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${isActiveTodos} ${isActiveTodos === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: selectedFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => handleFilterChange(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
