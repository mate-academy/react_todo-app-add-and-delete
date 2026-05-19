import React from 'react';
import cn from 'classnames';
import { TodoStatus, TodoStatusMap } from '../../types/Todo';
import { SetState } from '../../types/react';

type Props = {
  activeCount: number;
  completedCount: number;
  status: TodoStatus;
  onChangeFilterStatus: SetState<TodoStatus>;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeCount = 0,
  completedCount = 0,
  status,
  onChangeFilterStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === TodoStatusMap.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeFilterStatus(TodoStatusMap.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === TodoStatusMap.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeFilterStatus(TodoStatusMap.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === TodoStatusMap.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeFilterStatus(TodoStatusMap.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount < 1}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
