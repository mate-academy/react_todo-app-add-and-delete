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
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newStatus = event.currentTarget.textContent as Status;

    setStatus(newStatus);
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);

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
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.ALL,
          })}
          onClick={handleClick}
        >
          {Status.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })}
          onClick={handleClick}
        >
          {Status.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })}
          onClick={handleClick}
        >
          {Status.COMPLETED}
        </a>
      </nav>

      {todos.filter(todo => todo.completed).length > 0 && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
