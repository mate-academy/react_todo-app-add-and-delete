import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter, FilterType } from '../../App';
type Props = {
  todos: Todo[];
  filter: FilterType;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const filtersValues = Object.values(Filter);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {filtersValues.map(f => (
              <a
                key={f}
                href={`#/${f === 'all' ? '' : f}`}
                className={classNames('filter__link', {
                  selected: filter === f,
                })}
                data-cy={`FilterLink${f.charAt(0).toUpperCase() + f.slice(1)}`}
                onClick={() => onFilterChange(f as Filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </a>
            ))}
          </nav>

          <button
            disabled={!todos.some(todo => todo.completed)}
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => onClearCompleted()}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
