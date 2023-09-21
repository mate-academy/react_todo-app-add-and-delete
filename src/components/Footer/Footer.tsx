import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setVisibleTodos: (todos: Todo[]) => void,
};

enum Status {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const Footer: React.FC<Props> = ({
  todos,
  setVisibleTodos = () => { },
}) => {
  const [status, setStatus] = useState(Status.ALL);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newStatus = event.currentTarget.textContent as Status;

    setStatus(newStatus);
    switch (newStatus) {
      case Status.ACTIVE:
        setVisibleTodos(activeTodos);
        break;

      case Status.COMPLETED:
        setVisibleTodos(completedTodos);
        break;

      default:
        setVisibleTodos(todos);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={handleClick}
        >
          {Status.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={handleClick}
        >
          {Status.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleClick}
        >
          {Status.COMPLETED}
        </a>
      </nav>

      {completedTodos.length > 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
