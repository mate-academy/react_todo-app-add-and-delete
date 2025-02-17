import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  setTodoStatus: (todoStatus: TodoStatus) => void;
  onDelete: (id: number) => void;
};

const getActiveTodosArray = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed);
};

const getCompletedTodosArray = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed);
};

export const Footer: React.FC<Props> = ({
  todos,
  todoStatus,
  setTodoStatus,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getActiveTodosArray(todos).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: todoStatus === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTodoStatus(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: todoStatus === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTodoStatus(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: todoStatus === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTodoStatus(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={getCompletedTodosArray(todos).length === 0}
        onClick={() => {
          const allComplitedTodos = getCompletedTodosArray(todos);

          allComplitedTodos.map(todo => onDelete(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
