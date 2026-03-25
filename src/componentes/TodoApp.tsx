import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import classNames from 'classnames';
import { FILTERS } from '../filters/filter';

export const TodoApp: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    return null;
  }

  const {
    todo,
    handleActive,
    handleCompleted,
    handleFilterAll,
    filter,
    handleRemoveCompleted,
  } = context;

  const activeTodosCount = todo.filter(t => !t.completed).length;
  const hasCompleted = todo.some(t => t.completed);
  const { all, completed, active } = FILTERS;

  return (
    <>
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === all,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            handleFilterAll();
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            handleActive();
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            handleCompleted();
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        data-cy="ClearCompletedButton"
        onClick={handleRemoveCompleted}
      >
        Clear completed
      </button>
    </>
  );
};
