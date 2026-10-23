import React from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  status: Status;
  onStatusChange: (status: Status) => void;
  onDeleteAllCompletedTodos: () => void;
};

const FILTER_LINKS = [
  { status: Status.All, title: 'All', href: '#/' },
  { status: Status.Active, title: 'Active', href: '#/active' },
  { status: Status.Completed, title: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onDeleteAllCompletedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ status: linkStatus, title, href }) => (
          <a
            key={linkStatus}
            href={href}
            className={cn('filter__link', {
              selected: status === linkStatus,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => onStatusChange(linkStatus)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onDeleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
