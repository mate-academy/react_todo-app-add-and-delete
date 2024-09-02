import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  deleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  deleteCompletedTodo: deleteCompletedTodo,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const filters = [
    { label: Status.All, href: '#/', dataCy: 'FilterLinkAll' },
    { label: Status.Active, href: '#/active', dataCy: 'FilterLinkActive' },
    {
      label: Status.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.label}
            href={filter.href}
            className={cn('filter__link', {
              selected: status === filter.label,
            })}
            data-cy={filter.dataCy}
            onClick={() => setStatus(filter.label)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={deleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
