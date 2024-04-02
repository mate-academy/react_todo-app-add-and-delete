import React from 'react';
import { StatusFilter } from '../../types/StatusFilter';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  onStatusFilterClick: (statusFilterValue: StatusFilter) => void;
  todos: Todo[];
  statusFilter: StatusFilter;
};

export const TodoAppFooter: React.FC<Props> = ({
  onStatusFilterClick,
  todos,
  statusFilter,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(StatusFilter).map(([property, value]) => (
          <a
            key={property}
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: statusFilter === value,
            })}
            data-cy={`FilterLink${property}`}
            onClick={() => onStatusFilterClick(value)}
          >
            {property}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
