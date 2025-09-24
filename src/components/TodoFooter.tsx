import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../App';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilter: (type: Filter) => void;
  onClearCompletedTodos: () => void;
  activeTodos: number;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onFilter,
  onClearCompletedTodos,
  activeTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            ' selected': filter === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            ' selected': filter === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            ' selected': filter === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompletedTodos}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
