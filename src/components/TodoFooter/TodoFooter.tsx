import React, { useMemo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  onHandleDeleteCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  onHandleDeleteCompleted,
}) => {
  const completedTodos = todos.some(todo => todo.completed);
  const leftTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${leftTodos} item${leftTodos > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === FilterStatus.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(FilterStatus.ALL)}
        >
          {FilterStatus.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === FilterStatus.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(FilterStatus.ACTIVE)}
        >
          {FilterStatus.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === FilterStatus.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(FilterStatus.COMPLETED)}
        >
          {FilterStatus.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={onHandleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
