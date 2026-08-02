import React from 'react';
import { Todo } from '../types/Todo';

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  setFirstFilter: (filter: Filter) => void;
  firstFilter: Filter;
  todos: Todo[];
  cleared: () => void;
};

export const Todofilter: React.FC<Props> = ({
  setFirstFilter,
  firstFilter,
  todos,
  cleared,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterType => {
          const isSelected = firstFilter === filterType;

          const href =
            filterType === Filter.All ? '#/' : `#/${filterType.toLowerCase()}`;

          return (
            <a
              key={filterType}
              href={href}
              className={`filter__link ${isSelected ? 'selected' : ''}`}
              data-cy={`FilterLink${filterType}`}
              onClick={() => setFirstFilter(filterType)}
            >
              {filterType}
            </a>
          );
        })}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(obj => obj.completed).length === 0}
        onClick={cleared}
      >
        Clear completed
      </button>
    </footer>
  );
};
