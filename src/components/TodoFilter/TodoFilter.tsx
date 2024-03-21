import cn from 'classnames';
import React, { memo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Status,
  onFilterChange: (newFilter: Status) => void,
  todos: Todo[],
  onDelete: () => void,
};

export const TodoFilter: React.FC<Props> = memo(({
  filter,
  onFilterChange,
  todos,
  onDelete,
}) => {
  const handleLinkClick
    = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const currentPath = e.currentTarget.href.split('/');

      onFilterChange(currentPath[currentPath.length - 1] as Status);
    };

  const uncompletedTodosCount = todos.reduce((acc, todo) => {
    return todo.completed ? acc : acc + 1;
  }, 0);

  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <>
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href={`#/${Status.All}`}
          data-cy="FilterLinkAll"
          onClick={handleLinkClick}
          className={cn('filter__link', {
            selected: filter === Status.All,
          })}
        >
          All
        </a>

        <a
          href={`#/${Status.Active}`}
          data-cy="FilterLinkActive"
          onClick={handleLinkClick}
          className={cn('filter__link', {
            selected: filter === Status.Active,
          })}
        >
          Active
        </a>

        <a
          href={`#/${Status.Completed}`}
          data-cy="FilterLinkCompleted"
          onClick={handleLinkClick}
          className={cn('filter__link', {
            selected: filter === Status.Completed,
          })}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={!hasCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDelete}
      >
        Clear completed
      </button>
    </>
  );
});
