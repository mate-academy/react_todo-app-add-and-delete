import React from 'react';
import { TodoStatus } from '../types/SortTypes';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  selectedStatus: TodoStatus;
  onStatusChange: (status: TodoStatus) => void;
  filteringTodosByActiveStatus: number;
  TodoStatusRoutes: Record<TodoStatus, string>;
  isDisabled: boolean;
}

export const SortButtons: React.FC<Props> = ({
  todos,
  selectedStatus,
  onStatusChange,
  filteringTodosByActiveStatus,
  TodoStatusRoutes,
  isDisabled,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {filteringTodosByActiveStatus} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(TodoStatus).map(status => (
              <a
                key={status}
                href={`#${TodoStatusRoutes[status as TodoStatus]}`}
                className={classNames('filter__link', {
                  selected: selectedStatus === status,
                })}
                data-cy={`FilterLink${status}`}
                onClick={() => onStatusChange(status as TodoStatus)}
              >
                {status}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={isDisabled}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
