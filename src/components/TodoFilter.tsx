import React from 'react';
import cn from 'classnames';
import { TodosFilter } from '../types/TodosFilter';
import { Todo } from '../types/Todo';

const setFilterHref = (filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return '#/active';

    case TodosFilter.Completed:
      return '#/completed';

    case TodosFilter.All:
    default:
      return '#/';
  }
};

const setFilterDataCy = (filter: TodosFilter) => {
  switch (filter) {
    case TodosFilter.Active:
      return 'FilterLinkActive';

    case TodosFilter.Completed:
      return 'FilterLinkCompleted';

    case TodosFilter.All:
    default:
      return 'FilterLinkAll';
  }
};

type Props = {
  todos: Todo[]
  filter: TodosFilter;
  completedTodos: Todo[];
  onFilterChange: (filter: TodosFilter) => void;
  onClearCompletedTodos: () => void
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filter,
  completedTodos,
  onFilterChange,
  onClearCompletedTodos,
}) => {
  const uncompletedTodos = todos.length - completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos === 1
          ? `${uncompletedTodos} item left`
          : `${uncompletedTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodosFilter).map((value) => (
          <a
            href={setFilterHref(value)}
            className={cn('filter__link', { selected: value === filter })}
            data-cy={setFilterDataCy(value)}
            key={value}
            onClick={() => {
              onFilterChange(value as TodosFilter);
            }}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          { hidden: !completedTodos.length },
        )}
        data-cy="ClearCompletedButton"
        onClick={() => onClearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
