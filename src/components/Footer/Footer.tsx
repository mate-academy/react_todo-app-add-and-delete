import React, { memo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { Filter } from '../Filter/Filter';

type Props = {
  filterStatus: string;
  activeTodosQuantity: number;
  isAnyTodoCompleted: boolean;
  onClear: () => void;
  onFilterStatusChange: React.Dispatch<React.SetStateAction<FilterStatus>>;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    filterStatus,
    activeTodosQuantity,
    isAnyTodoCompleted,
    onClear,
    onFilterStatusChange,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosQuantity} items left`}
      </span>

      <Filter
        filterStatus={filterStatus}
        onFilterStatusChange={onFilterStatusChange}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: `${isAnyTodoCompleted ? 'visible' : 'hidden'}` }}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
});
