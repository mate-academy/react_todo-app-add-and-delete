import React from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import { StatusFilter } from '../StatusFilter';

type Props = {
  selectStatus: (status:TodoStatus)=> void;
  selectedStatus: TodoStatus;
};

export const Footer:React.FC<Props> = ({ selectStatus, selectedStatus }) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <StatusFilter
        selectStatus={selectStatus}
        selectedStatus={selectedStatus}
      />

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
