import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

type Props = {
  filterBy: TodoStatus;
  setFilterBy: (value: TodoStatus) => void;
  todos: Todo[];
  clearAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todos,
  clearAllCompletedTodos,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const isCompletedInTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedInTodos}
        onClick={clearAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
