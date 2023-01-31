import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { Filter } from '../Filter/Filter';

type Props = {
  filterStatus: FilterStatus;
  todosLeft: number;
  AllTodosLength: number;
  onFilterSelect: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = (
  {
    filterStatus,
    todosLeft,
    AllTodosLength,
    onFilterSelect,
    onClearCompleted,
  },
) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <Filter filterStatus={filterStatus} onFilterSelect={onFilterSelect} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={todosLeft === AllTodosLength}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
