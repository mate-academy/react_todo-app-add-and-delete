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
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLength - completedTodosLength} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusTodo === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusTodo === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusTodo === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
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
