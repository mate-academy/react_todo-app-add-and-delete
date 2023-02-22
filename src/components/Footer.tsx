import classNames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  activeCount: number,
  status: Status,
  setStatus: Dispatch<SetStateAction<Status>>,
  onDelete: (id: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  activeCount,
  status,
  setStatus,
  onDelete,
}) => {
  const isThereAnyCompleted = useMemo(() => (
    todos.some(({ completed }) => completed)
  ), [todos]);

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(({ completed, id }) => {
      if (completed) {
        onDelete(id);
      }
    });
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Status.All },
          )}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: status === Status.ACTIVE },
          )}
          onClick={() => setStatus(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: status === Status.COMPLETED },
          )}
          onClick={() => setStatus(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          {
            'todoapp__clear-completed': isThereAnyCompleted,
            'todoapp__clear-completed--disabled': !isThereAnyCompleted,
          },
        )}
        disabled={!isThereAnyCompleted}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
