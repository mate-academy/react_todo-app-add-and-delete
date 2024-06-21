import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  selectedParam: TodoStatus;
  onSelectParam: (param: TodoStatus) => void;
  deleteAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  selectedParam,
  onSelectParam,
  deleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedParam === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onSelectParam(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedParam === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onSelectParam(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedParam === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSelectParam(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCount}
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
