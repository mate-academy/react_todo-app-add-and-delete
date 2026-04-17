import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../Constants/Filters';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  remaining: number;
  filter: Filter;
  setFilter: (f: Filter) => void;
  hasCompleted: boolean;
  clearCompleted: () => void;
  disabledFooter?: boolean;
};

export const Footer: React.FC<Props> = ({
  todos,
  remaining,
  filter,
  setFilter,
  hasCompleted,
  clearCompleted,
  disabledFooter = false,
}) => {
  return (
    <footer
      className={classNames('todoapp__footer', {
        hidden: todos.length === 0,
      })}
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {`${remaining} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(f => (
          <a
            key={f.value}
            href={f.href}
            onClick={event => {
              event.preventDefault();
              setFilter(f.value);
            }}
            className={classNames('filter__link', {
              selected: filter === f.value,
            })}
            data-cy={f.dataCy}
          >
            {f.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted || disabledFooter}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
