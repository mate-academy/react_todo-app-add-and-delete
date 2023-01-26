import React, { memo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { Filter } from '../Filter/Filter';

type Props = {
  filterStatus: string;
  activeTodosQuantity: number;
  isAnyTodoCompleted: boolean;
  clearAllCompletedTodos: () => void;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    filterStatus,
    activeTodosQuantity,
    isAnyTodoCompleted,
    setFilterStatus,
    clearAllCompletedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosQuantity} items left`}
      </span>

      <Filter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: `${isAnyTodoCompleted ? 'visible' : 'hidden'}` }}
        onClick={clearAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
