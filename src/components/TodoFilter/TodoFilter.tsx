import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type TodoFilterProps = {
  handleFilterStatus: (status: TodoStatus) => void,
  todosFilterStatus: TodoStatus
};

export const TodoFilter: React.FC<TodoFilterProps> = ({
  handleFilterStatus,
  todosFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: todosFilterStatus === TodoStatus.All,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(TodoStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: todosFilterStatus === TodoStatus.Active,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(TodoStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: todosFilterStatus === TodoStatus.Completed,
        })}
        onClick={(event) => {
          event.preventDefault();
          handleFilterStatus(TodoStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
