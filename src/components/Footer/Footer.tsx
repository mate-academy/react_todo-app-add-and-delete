import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  currentTodos: Todo[];
  todosFilter: string;
  setTodosFilter: React.Dispatch<React.SetStateAction<FilterStatus>>;
  setShouldDeleteCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Footer: React.FC<Props> = ({
  currentTodos,
  todosFilter,
  setTodosFilter,
  setShouldDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {currentTodos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: todosFilter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTodosFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: todosFilter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTodosFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: todosFilter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTodosFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => setShouldDeleteCompleted(true)}
        disabled={currentTodos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
