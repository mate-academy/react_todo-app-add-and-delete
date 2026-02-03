import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Status } from '../../types/Status';

interface PropsFooter {
  todos: Todo[];
  filter: Filter;
  onFilter: (value: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<PropsFooter> = ({
  todos,
  filter,
  onFilter,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {todos.length > 0 && (
        <>
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCount} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            {Object.values(Status).map(statusValue => (
              <a
                key={statusValue}
                href={`#/${statusValue === Status.All ? '' : statusValue}`}
                className={cn('filter__link', {
                  selected: filter === statusValue,
                })}
                data-cy={`FilterLink${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}`}
                onClick={() => onFilter(statusValue)}
              >
                {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
              </a>
            ))}
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={onClearCompleted}
            disabled={!hasCompleted}
          >
            Clear completed
          </button>
        </>
      )}
    </footer>
  );
};
