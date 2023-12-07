import React, { useContext } from 'react';
import cn from 'classnames';

import { Status } from '../../types/Status';
import { TodosContext } from '../TodosContext';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    todoFilter,
    setTodoFilter,
  } = useContext(TodosContext);

  const activeTodosCount = (
    `${todos.filter(todo => !todo.completed).length} items left`
  );

  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {activeTodosCount}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          href="#/"
          className={cn('filter__link', {
            selected: todoFilter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTodoFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todoFilter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTodoFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todoFilter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTodoFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
