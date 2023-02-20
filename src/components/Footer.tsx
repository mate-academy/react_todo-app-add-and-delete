import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filters } from '../utils/filters';

type Props = {
  todos: Todo[],
  filter: Filters,
  setFilter: (filter: Filters) => void;
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const unCompletedTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${unCompletedTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.All,
          })}
          onClick={() => {
            setFilter(Filters.All);
          }}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.Active,
          })}
          onClick={() => {
            setFilter(Filters.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.Completed,
          })}
          onClick={() => {
            setFilter(Filters.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed')}
        onClick={onClearCompleted}
        style={{
          visibility: completedTodos.length ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
