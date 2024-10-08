import classNames from 'classnames';
import { Status } from '../../App';

type Props = {
  statusTodo: Status;
  todosLength: number;
  completedTodosLength: number;
  onStatus: (val: Status) => void;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLength,
  completedTodosLength,
  onStatus,
  onDeleteCompleted,
  statusTodo,
}) => {
  const statuses = Object.values(Status);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLength - completedTodosLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {statuses.map(status => (
          <a
            key={status}
            href={'#/' + Status[status]}
            className={classNames('filter__link', {
              selected: statusTodo === status,
            })}
            data-cy={'FilterLink' + status}
            onClick={() => onStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={completedTodosLength < 1}
      >
        Clear completed
      </button>
    </footer>
  );
};
