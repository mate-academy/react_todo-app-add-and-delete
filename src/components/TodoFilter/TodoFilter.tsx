import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  all: boolean,
  active: boolean,
  completedTodo: boolean,
  statusTodosHandler: (value: string) => void,
  statusTodo: string,
  setStatus: (value: string) => void,
};

export const TodoFilter: React.FC<Props> = ({
  all,
  active,
  completedTodo,
  statusTodosHandler,
  statusTodo,
  setStatus,
}) => {
  useEffect(() => {
    statusTodosHandler(statusTodo);
  }, [statusTodo]);

  const changeStatus = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (event.currentTarget.textContent) {
      setStatus(event.currentTarget.textContent);
    }
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', { selected: all })}
        onClick={changeStatus}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', { selected: active })}
        onClick={changeStatus}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', { selected: completedTodo })}
        onClick={changeStatus}
      >
        Completed
      </a>
    </nav>
  );
};
