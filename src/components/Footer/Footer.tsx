import { STATUS_FILTER_OPTIONS, StatusFilter } from '../../types/statusFilter';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type FooterProps = {
  todos: Todo[];
  status: StatusFilter;
  todosLeft: number;
  onDeleteAll: () => void;
  onStatusChange: (newStatus: StatusFilter) => void;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  status,
  todosLeft,
  onDeleteAll,
  onStatusChange,
}) => {
  const completedTodo = todos?.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(STATUS_FILTER_OPTIONS).map(
          ([option, { href, testId, text }]) => (
            <a
              key={option}
              href={href}
              className={cn('filter__link', {
                selected: status === option,
              })}
              data-cy={testId}
              onClick={() => onStatusChange(option as StatusFilter)}
            >
              {text}
            </a>
          ),
        )}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAll}
        disabled={completedTodo === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
