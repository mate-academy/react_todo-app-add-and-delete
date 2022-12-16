import React from 'react';
import { Todo } from '../../types/Todo';
import { NavFooter } from '../NavFooter/NavFooter';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  notCompleted: number,
  filterStatus: FilterStatus,
  setFilterStatus: (filter: FilterStatus) => void,
  todos: Todo[],
  removeAllDone: () => void,
};

export const Footer: React.FC<Props> = ({
  notCompleted, filterStatus, setFilterStatus, todos, removeAllDone,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompleted} items left`}
      </span>
      <NavFooter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed === true)}
        onClick={removeAllDone}
      >
        Clear completed
      </button>
    </footer>
  );
};
