import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';
import { filterOptions } from '../../App';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterStatus: Filter;
  setFilterStatus: (title: Filter) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {
          todos.filter(todo => {
            return !todo.completed;
          }).length
        }{' '}
        items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ id, title, href }) => (
          <a
            key={id}
            href={href}
            className={classNames('filter__link', {
              selected: filterStatus === title,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => setFilterStatus(title)}
          >
            {title}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
