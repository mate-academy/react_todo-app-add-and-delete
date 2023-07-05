import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todos: Todo[];
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
};

export const Footer: React.FC<Props> = ({ todos, filterBy, setFilterBy }) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {itemsLeft}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(FilterBy).map((filter) => (
          <a
            href="#/"
            className={classNames('filter__link',
              { selected: filterBy === filter })}
            onClick={() => setFilterBy(filter)}
            key={filter}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
