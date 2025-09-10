import { useState } from 'react';
import { StatusFilter, Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  setStatusFilter: (
    value: StatusFilter.All | StatusFilter.Active | StatusFilter.Completed,
  ) => void;
  todos: Todo[];
  handleClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  setStatusFilter,
  todos,
  handleClearCompleted,
}) => {
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const someCompletedTodos = todos.some(todo => todo.completed === true);

  const handleStatusChange = (e: StatusFilter) => {
    setStatusFilter(e);
    setStatus(e);
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: status === StatusFilter.All,
              })}
              data-cy="FilterLinkAll"
              onClick={() => handleStatusChange(StatusFilter.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: status === 'active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => handleStatusChange(StatusFilter.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: status === StatusFilter.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => handleStatusChange(StatusFilter.Completed)}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
            disabled={!someCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
