import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[];
  setStatus: (status: Status) => void;
  status: Status
  clearAll: (todosToDelete: number[]) => void;
};
export const Footer: React.FC<Props> = (
  {
    todos,
    setStatus,
    status,
    clearAll,
  },
) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completed = todos.filter(todo => todo.completed).map(todo => todo.id);

  console.log(completed.length);

  const handleClick = (value: Status) => {
    setStatus(value);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: status === Status.ALL,
            },
          )}
          onClick={() => {
            handleClick(Status.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: status === Status.ACTIVE,
            },
          )}
          onClick={() => {
            handleClick(Status.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: status === Status.COMPLETED,
            },
          )}
          onClick={() => {
            handleClick(Status.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            hidden: completed.length === 0,
          },
        )}
        onClick={() => {
          clearAll(completed);
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
