import React from 'react';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type FooterProps = {
  filteredBy: Filter;
  setFilteredBy: React.Dispatch<React.SetStateAction<Filter>>;
  todosCounter: number;
  clearCompleted: () => void;
  completedTodos: Todo[];
};

export const Footer: React.FC<FooterProps> = ({
  filteredBy,
  setFilteredBy,
  todosCounter,
  clearCompleted,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map((filter: Filter) => {
          return (
            <a
              href={`#/${filter === Filter.All ? '' : filter.toLowerCase()}`}
              key={filter}
              className={classNames('filter__link', {
                selected: filteredBy === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setFilteredBy(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
