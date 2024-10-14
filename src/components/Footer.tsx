import React from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../utils/getFilteredTodos';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  status: TodoStatus;
  setStatus: (status: TodoStatus) => void;
  handleDeletingAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  handleDeletingAllCompleted,
}) => {
  const remainingTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={handleDeletingAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
