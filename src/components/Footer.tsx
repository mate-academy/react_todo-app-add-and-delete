import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  deleteCompleteTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  deleteCompleteTodo,
}) => {
  const todosLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(Status).map(key => (
          <a
            key={key}
            href={`#/${key.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === Status[key as keyof typeof Status],
            })}
            data-cy={`FilterLink${key}`}
            onClick={() => setStatus(Status[key as keyof typeof Status])}
          >
            {Status[key as keyof typeof Status]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={deleteCompleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
