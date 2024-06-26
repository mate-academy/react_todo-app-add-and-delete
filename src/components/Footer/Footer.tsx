import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  status: TodoStatus;
  setStatus: (status: TodoStatus) => void;
  onRemoveTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  onRemoveTodo,
}) => {
  const remainingTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onRemoveTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
