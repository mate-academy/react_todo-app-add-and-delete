import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';
import { Filter } from '../utils/Enums';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  filter: string;
  setFilter: (value: Filter) => void;
  completedTodos: Todo[] | [];
  notCompletedTodos: Todo[] | [];
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  completedTodos,
  notCompletedTodos,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={uuidv4()}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilter(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
