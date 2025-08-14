import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  currentSelect: string;
  onSelectStatus: (status: 'All' | 'Active' | 'Completed') => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentSelect,
  onSelectStatus,
  onClearCompleted,
}) => {
  const completedTodos = () => {
    return todos.some(todo => todo.completed);
  };

  const todosCounter = () => todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter()} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentSelect === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={event => {
            event.preventDefault();
            onSelectStatus('All');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentSelect === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={event => {
            event.preventDefault();
            onSelectStatus('Active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentSelect === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            event.preventDefault();
            onSelectStatus('Completed');
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
        onClick={() => onClearCompleted()}
        disabled={!completedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
