import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: () => void;
};

const filterLinks: { status: Status; label: string; dataCy: string }[] = [
  { status: Status.All, label: 'All', dataCy: 'FilterLinkAll' },
  { status: Status.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  {
    status: Status.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.status}
            href={link.status === Status.All ? '#/' : `#/${link.status}`}
            className={classNames('filter__link', {
              selected: status === link.status,
            })}
            data-cy={link.dataCy}
            onClick={() => onStatusChange(link.status)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
