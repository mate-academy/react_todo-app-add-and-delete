import React from 'react';
import { hasTodoCompleted } from '../Utilites/FinderUtils';
import cn from 'classnames';
import { Todo } from '../Types/TodoType';
import { Status } from '../Types/StatusType';

type Props = {
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  onDeleteCompleted: () => void;
  status: Status;
  todos: Todo[];
};

export const TodoFilter: React.FC<Props> = ({
  setStatus,
  onDeleteCompleted,
  todos,
  status,
}) => {
  const links = Object.entries(Status);

  const totalActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="TodoFilter">
      <span className="todo-count" data-cy="TodosCounter">
        {totalActiveTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === Status.All ? '' : `${value}`}`}
            className={cn('filter__link', { selected: status === value })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => setStatus(value)}
          >
            {key}
          </a>
        ))}
      </nav>
      <button
        disabled={!hasTodoCompleted(todos)}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
