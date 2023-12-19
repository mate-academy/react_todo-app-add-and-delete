import React from 'react';
import cn from 'classnames';

import type { Todo } from '../../types/Todo';
import { StatusFilter } from '../../types/StatusFilter';

interface Props {
  todos: Todo[];
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  deleteTodo: (id: number) => void;
}

export const Footer: React.FC<Props> = React.memo((props) => {
  const {
    todos,
    statusFilter,
    setStatusFilter,
    deleteTodo,
  } = props;

  const handleClearAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

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
          {StatusFilter.ALL}
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
          {StatusFilter.ACTIVE}
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
          {StatusFilter.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearAllCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
});
