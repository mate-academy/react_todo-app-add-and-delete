/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { FilterBy } from '../../types/FilterBy';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: FilterBy;
  setFilterBy: (arg: FilterBy) => void;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos = [],
  filterBy,
  setFilterBy,
  deleteCompletedTodos,
}) => {
  const completeTodosNum = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {completeTodosNum} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterBy).map(([key, label]) => (
          <a
            key={key}
            href={`#/${key}`}
            className={classNames('filter__link', {
              selected: filterBy === label,
            })}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilterBy(label)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={e => {
          e.preventDefault();
          deleteCompletedTodos();
        }}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
