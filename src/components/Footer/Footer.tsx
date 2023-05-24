import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOption } from '../../types/FilterOption';

interface Props {
  todos: Todo[];
  filter: string;
  setFilter: (filter: FilterOption) => void;
}

export const Footer: React.FC<Props> = ({ todos, filter, setFilter }) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todos.length} items left`}</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterOption.ALL,
          })}
          onClick={() => setFilter(FilterOption.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterOption.ACTIVE,
          })}
          onClick={() => setFilter(FilterOption.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterOption.COMPLETED,
          })}
          onClick={() => setFilter(FilterOption.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {todos.find((todo) => todo.completed) && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
