import React from 'react';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../constants/FilterTypes';
import { FilterType } from '../types/FilterType';
import classNames from 'classnames';

interface FooterProps {
  todos: Todo[];
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  clearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({ todos, filter, setFilter, clearCompletedTodos}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType}`}
            className={classNames({ selected: filter === filterType })}
            onClick={() => setFilter(filterType)}
            data-cy={`FilterLink${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </a>
        ))}
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames("todoapp__clear-completed", { disabled: todos.every(todo => !todo.completed) })}
        onClick={clearCompletedTodos}
        disabled={todos.every((todo) => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
