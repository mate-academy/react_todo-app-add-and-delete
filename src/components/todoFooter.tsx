import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

type Props = {
  setTodoFilter: (status: TodoStatus) => void;
  todoFilter: TodoStatus;
  todos: Todo[];
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  setTodoFilter,
  todoFilter,
  todos,
  removeCompletedTodos,
}) => {
  const isClearButtonVisible = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todos.length === 1
          ? '1 item left'
          : `${todos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: todoFilter === TodoStatus.All,
          })}
          onClick={() => setTodoFilter(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todoFilter === TodoStatus.Active,
          })}
          onClick={() => setTodoFilter(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todoFilter === TodoStatus.Completed,
          })}
          onClick={() => setTodoFilter(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {isClearButtonVisible && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompletedTodos}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
