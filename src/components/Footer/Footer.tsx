import classNames from 'classnames';
import React, { memo } from 'react';
import { Filter } from '../Filter/Filter';

type Props = {
  filterStatus: string;
  changeStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  notCompletedTodosLength: number;
  onDeleteCompletedTodos: () => void;
  completedTodosLength: number;
};

export const Footer: React.FC<Props> = memo(({
  filterStatus,
  changeStatusFilter,
  notCompletedTodosLength,
  onDeleteCompletedTodos,
  completedTodosLength,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompletedTodosLength} items left`}
      </span>

      <Filter filterStatus={filterStatus} onFilterStatus={changeStatusFilter} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': !completedTodosLength,
        })}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
