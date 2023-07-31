import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  filterType: string,
  setFilterType: (filterType: string) => void,
  deleteCompletedTodo: () => void,
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  deleteCompletedTodo,
}) => {
  const hasCompletedTodo = todos.some(todo => todo.completed);
  const leftActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === 'all',
          })}
          onClick={() => setFilterType('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === 'active',
          })}
          onClick={() => setFilterType('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === 'completed',
          })}
          onClick={() => setFilterType('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompletedTodo()}
      >
        {hasCompletedTodo ? ('Clear completed') : null}
      </button>

    </footer>
  );
};
