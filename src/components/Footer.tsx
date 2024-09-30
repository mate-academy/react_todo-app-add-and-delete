import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

interface Props {
  filterBy: TodoFilter;
  setFilter: (value: TodoFilter) => void;
  todos: Todo[];
  onClearCompleted: (ids: number[]) => void;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilter,
  todos,
  onClearCompleted,
}) => {
  const completedTodoIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const numOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const todoCounterTitle =
    (numOfActiveTodos !== 1
      ? `${numOfActiveTodos} items`
      : `${numOfActiveTodos} item`) + ' left';

  const clearCompletedHandler = () => {
    onClearCompleted(completedTodoIds);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounterTitle}
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>
      {/*this button should be disabled if there are no completed todos*/}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodoIds.length}
        onClick={clearCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
