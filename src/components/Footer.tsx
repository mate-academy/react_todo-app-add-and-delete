/* eslint-disable react/display-name */
import { memo } from 'react';
import { TodoStatus, TodoStatusRoutes } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  selectedStatus: TodoStatus;
  setStatus: (todoStatus: TodoStatus) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  removeTodos: () => void;
}

export const Footer = memo((props: Props) => {
  const {
    setStatus,
    activeTodosCount,
    completedTodosCount,
    selectedStatus,
    removeTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(TodoStatusRoutes).map(status => (
          <a
            key={status}
            href={`#${TodoStatusRoutes[status as TodoStatus]}`}
            className={classNames('filter__link', {
              selected: selectedStatus === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setStatus(status as TodoStatus)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={removeTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
