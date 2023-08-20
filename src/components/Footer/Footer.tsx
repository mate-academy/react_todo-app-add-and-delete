import React, { useContext, useMemo } from 'react';
import cn from 'classnames';

import { Filters } from '../../types/Filters';
import { TodosContext } from '../../utils/TodosContext';

interface Props {
  filter: Filters,
  onFilter: (value: Filters) => void,
  onClear: () => void;
}

export const Footer: React.FC<Props> = ({ filter, onFilter, onClear }) => {
  const { todos } = useContext(TodosContext);

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todos.length === 1
          ? `${todos.length} item left`
          : `${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === Filters.All },
          )}
          onClick={() => onFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === Filters.Active },
          )}
          onClick={() => onFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === Filters.Completed },
          )}
          onClick={() => onFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClear}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
