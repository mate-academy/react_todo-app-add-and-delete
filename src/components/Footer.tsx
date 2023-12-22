/* eslint-disable max-len */
import React, { useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter:string;
  setFilter : (filter: string) => void
};
export const Footer : React.FC<Props> = ({ todos, filter, setFilter }) => {
  const noCompletedItems = useMemo(() => todos.filter(el => el.completed === false).length, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${noCompletedItems} items left`}

      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'All' })}
          data-cy="FilterLinkAll"
          onMouseDown={() => {
            setFilter('All');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'Active' })}
          data-cy="FilterLinkActive"
          onMouseDown={() => {
            setFilter('Active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'Completed' })}
          data-cy="FilterLinkCompleted"
          onMouseDown={() => {
            setFilter('Completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={!todos.some((el) => el.completed === true)}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onMouseDown={() => {
          setFilter('Clear');
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
