import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { StatusFilter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: StatusFilter,
  setStatusFilter: (item: StatusFilter) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
  setStatusFilter,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatusFilter(StatusFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatusFilter(StatusFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatusFilter(StatusFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasSomeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
