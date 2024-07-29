import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/SortTypes';
import React from 'react';

type Props = {
  onClick: (status: string) => void;
  status: string;
  leftItems: number;
  completedItems: Todo[];
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  onClick,
  status,
  leftItems,
  completedItems,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: !status })}
          data-cy="FilterLinkAll"
          onClick={() => onClick('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onClick(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedItems.length === 0}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
