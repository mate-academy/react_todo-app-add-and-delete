import classNames from 'classnames';
import { Todo } from './types/Todo';
import React from 'react';

type Props = {
  filter: string;
  filterTodos: Todo[] | null;
  setFilter: (filter: string) => void;
  deleteCompleted: () => void;
};

export const Footer = ({
  filter,
  filterTodos,
  setFilter,
  deleteCompleted,
}: Props) => {
  const completedTodos = filterTodos?.filter(todo => todo.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {filterTodos
          ? filterTodos.filter(fTodos => !fTodos.completed).length +
            ' items left'
          : ''}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames({
            filter__link: true,
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames({
            filter__link: true,
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames({
            filter__link: true,
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={completedTodos?.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
