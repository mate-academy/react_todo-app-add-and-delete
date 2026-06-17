import { Todo } from '../types/Todo';
import React from 'react';

type Prop = {
  todos: Todo[];
  filter: string;
  setFilter: (filter: string) => void;
  onClear: () => void;
};

export const Footer: React.FC<Prop> = ({
  todos,
  filter,
  setFilter,
  onClear,
}) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.filter((todo: Todo) => !todo.completed).length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {['All', 'Active', 'Completed'].map(filterName => {
            return (
              <a
                href="#/"
                className={`filter__link ${filter === filterName ? 'selected' : ''}`}
                data-cy={`FilterLink${filterName}`}
                key={filterName}
                onClick={() => setFilter(filterName)}
              >
                {filterName}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!todos.some(todo => todo.completed)}
          onClick={onClear}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
