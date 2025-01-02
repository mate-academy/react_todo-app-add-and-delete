import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Filter } from '../utils/enamFilter';

type Props = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const leftItems = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.keys(Filter).map(key => (
          <a
            key={key}
            href={`#/${key}`}
            className={classNames('filter__link', {
              selected: filter === key.toLowerCase(),
            })}
            data-cy={`FilterLink${key}`}
            onClick={() =>
              setFilter(key.toLowerCase() as 'all' | 'active' | 'completed')
            }
          >
            {key}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
