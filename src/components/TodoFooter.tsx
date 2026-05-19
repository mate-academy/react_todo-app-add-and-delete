import React from 'react';
import classNames from 'classnames';

enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  todosLeft: number;
  hasCompletedTodos: boolean;
  filterByStatus: TodoStatus;
  setFilterByStatus: React.Dispatch<React.SetStateAction<TodoStatus>>;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  todosLeft,
  hasCompletedTodos,
  filterByStatus,
  setFilterByStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterByStatus === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterByStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterByStatus === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterByStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterByStatus === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterByStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
