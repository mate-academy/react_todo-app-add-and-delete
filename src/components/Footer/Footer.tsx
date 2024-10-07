import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  filterStatus: string;
  setFilterStatus: (status: Status) => void;
  todos: Todo[];
  handleClearComplete: () => void;
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todos,
  handleClearComplete,
}) => {
  const filtredActiveTodos = todos.filter((todo: Todo) => !todo.completed);
  const filtredCompleteTodos = todos.filter((todo: Todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filtredActiveTodos.length} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map((status: Status) => (
          <a
            key={status}
            href="#/"
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!filtredCompleteTodos.length}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
