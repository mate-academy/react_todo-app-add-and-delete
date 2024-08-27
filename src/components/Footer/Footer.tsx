import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  onClearCompleted,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const isCompleted = todos.some(todo => todo.completed);

  const filters = {
    All: Status.All,
    Active: Status.Active,
    Completed: Status.Completed,
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(filters).map(([key, value]) => (
          <a
            key={value}
            href={`#/`}
            className={cn('filter__link', {
              selected: status === value,
            })}
            data-cy={`FilterLink${key}`}
            onClick={() => setStatus(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
