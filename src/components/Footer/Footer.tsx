import React from 'react';
import cn from 'classnames';

import type { Todo } from '../../types/Todo';
import { StatusFilter } from '../../types/StatusFilter';

type Props = {
  todos: Todo[],
  statusFilter: StatusFilter,
  setStatusFilter: (status: StatusFilter) => void,
};

export const Footer: React.FC<Props> = React.memo((props) => {
  const { todos, statusFilter, setStatusFilter } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: statusFilter === StatusFilter.ALL },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setStatusFilter(StatusFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: statusFilter === StatusFilter.ACTIVE },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setStatusFilter(StatusFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: statusFilter === StatusFilter.COMPLETED },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatusFilter(StatusFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
});
