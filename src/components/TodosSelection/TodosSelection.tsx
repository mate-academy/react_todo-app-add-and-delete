import React from 'react';
import classNames from 'classnames';
import { TodosFilter } from '../../types/TodosFilter';

interface Props {
  completedTodosLength: number;
  todosLength: number;
  statusToFilter: TodosFilter;
  setStatusToFilter: React.Dispatch<React.SetStateAction<TodosFilter>>;
  removeAllCompletedTodos: () => Promise<void>;
}

export const TodosSelection: React.FC<Props> = React.memo(({
  completedTodosLength,
  statusToFilter,
  todosLength,
  setStatusToFilter,
  removeAllCompletedTodos,
}) => {
  const uncompletedTodosLength = todosLength - completedTodosLength;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: statusToFilter === TodosFilter.All,
          })}
          onClick={() => setStatusToFilter(TodosFilter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: statusToFilter === TodosFilter.Active,
          })}
          onClick={() => setStatusToFilter(TodosFilter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusToFilter === TodosFilter.Completed,
          })}
          onClick={() => setStatusToFilter(TodosFilter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: todosLength === uncompletedTodosLength,
        })}
        onClick={removeAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
