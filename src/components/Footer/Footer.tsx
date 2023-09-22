import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTodos } from '../../TodosContext';
import { Status } from '../../types/Status';

export const Footer: React.FC = () => {
  const {
    todos,
    clearCompleted,
    selectedStatus,
    setSelectedStatus,
    notCompletedTodos,
  } = useTodos();

  const onFilterSelect = (status: Status) => () => {
    setSelectedStatus(status);
  };

  const areCompleatedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer
      className={classNames('todoapp__footer', {
        hidden: todos.length === 0,
      })}
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {notCompletedTodos === 1 ? (
          '1 item left'
        ) : (
          `${notCompletedTodos} items left`
        )}
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          href="#/"
          onClick={onFilterSelect(Status.All)}
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: selectedStatus === Status.All,
          })}
        >
          All
        </a>

        <a
          href="#/active"
          onClick={onFilterSelect(Status.Active)}
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: selectedStatus === Status.Active,
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={onFilterSelect(Status.Completed)}
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: selectedStatus === Status.Completed,
          })}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!areCompleatedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
