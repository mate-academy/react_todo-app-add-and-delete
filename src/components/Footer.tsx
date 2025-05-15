import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filter: string;
  todos: Todo[];
  setFilter: (param: 'all' | 'active' | 'completed') => void;
};

export const Footer: React.FC<Props> = ({ filter, setFilter, todos }) => {
  if (todos.length === 0) {
    return null;
  }

  const activeTasksCount = todos.filter(e => !e.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTasksCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter('completed');
          }}
        >
          Completed
        </a>
      </nav>

        <button
          type="button"
          className={classNames=("todoapp__clear-completed", {
            "disabled": activeTasksCount !== todos.length
          })}
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
    </footer>
  );
};
