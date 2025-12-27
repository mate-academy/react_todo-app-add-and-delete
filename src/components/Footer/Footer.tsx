import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface FooterProps {
  todos: Todo[];
  activeCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  activeCount,
  filter,
  setFilter,
  onDeleteCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.All);
        }}
      >
        All
      </a>
      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.Active);
        }}
      >
        Active
      </a>
      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        onClick={e => {
          e.preventDefault();
          setFilter(Filter.Completed);
        }}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      data-cy="ClearCompletedButton"
      className="todoapp__clear-completed"
      disabled={!todos.some(todo => todo.completed)}
      onClick={onDeleteCompleted}
    >
      Clear completed
    </button>
  </footer>
);
