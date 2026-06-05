import clsx from 'clsx';
import { FilterParams } from '../App';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  countTodos: number;
  filter: FilterParams;
  newFilterParam: (p: FilterParams) => void;
  todos: Todo[];
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  countTodos,
  filter,
  newFilterParam,
  todos,
  deleteCompleted,
}) => {
  const isCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={clsx('filter__link', filter === 'All' && 'selected')}
          data-cy="FilterLinkAll"
          onClick={() => newFilterParam('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={clsx('filter__link', filter === 'Active' && 'selected')}
          data-cy="FilterLinkActive"
          onClick={() => newFilterParam('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={clsx('filter__link', filter === 'Completed' && 'selected')}
          data-cy="FilterLinkCompleted"
          onClick={() => newFilterParam('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleted}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
