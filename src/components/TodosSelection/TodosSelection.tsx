import React from 'react';
import classNames from 'classnames';
import { TodosStatus } from '../../types/TodosStatus';

interface Props {
  todosStatus: TodosStatus;
  setTodosStatus: React.Dispatch<React.SetStateAction<TodosStatus>>;
  todosLength: number;
  completedTodosLength: number;
  removeAllCompletedTodos: () => Promise<void>;
}

export const TodosSelection: React.FC<Props> = React.memo(({
  todosStatus,
  setTodosStatus,
  todosLength,
  completedTodosLength,
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
            selected: todosStatus === TodosStatus.All,
          })}
          onClick={() => setTodosStatus(TodosStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: todosStatus === TodosStatus.Active,
          })}
          onClick={() => setTodosStatus(TodosStatus.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: todosStatus === TodosStatus.Completed,
          })}
          onClick={() => setTodosStatus(TodosStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--hidden': completedTodosLength === 0,
        })}
        onClick={removeAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
