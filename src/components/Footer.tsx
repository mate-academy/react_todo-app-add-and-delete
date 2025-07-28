import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  filterStatus: Filter;
  handleFilterBy: (status: '' | 'active' | 'completed') => void;
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  handleFilterBy,
  handleDeleteCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todos.filter(todo => !todo.completed).length} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filterStatus === '' && `selected`}`}
        data-cy="FilterLinkAll"
        onClick={e => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          e.preventDefault();
          handleFilterBy('');
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filterStatus === 'active' && `selected`}`}
        data-cy="FilterLinkActive"
        onClick={e => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          e.preventDefault();
          handleFilterBy('active');
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filterStatus === 'completed' && `selected`}`}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          e.preventDefault();
          handleFilterBy('completed');
        }}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleDeleteCompleted}
      disabled={!todos.some(todo => todo.completed)}
    >
      Clear completed
    </button>
  </footer>
);
