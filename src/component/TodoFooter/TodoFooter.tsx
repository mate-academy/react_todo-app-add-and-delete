import { Todo } from '../../types/Todo';
import cls from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

export interface TodoFooterProps {
  setStatus: (status: string) => void;
  todos: Todo[];
  status: string;
  deleteCompletedTodo: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  status,
  setStatus,
  deleteCompletedTodo,
}) => {
  const todosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cls('filter__link', {
            selected: status === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setStatus('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cls('filter__link', {
            selected: status === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setStatus(Status.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cls('filter__link', {
            selected: status === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setStatus(Status.completed);
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
        disabled={todosCount === 0}
        onClick={() => deleteCompletedTodo()}
      >
        Clear completed
      </button>
    </footer>
  );
};
