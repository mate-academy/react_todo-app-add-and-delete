import { FC } from 'react';
import './TodoFooter.scss';

import { StatusFilter } from '../../types';
import { TodoFilter } from '../TodoFilter';

interface Props {
  leftTodos: number;
  statusFilter: StatusFilter;
  onChangeStatusFilter: (status: StatusFilter) => void;
  todosAmount: number;
  onClearCompleted: () => void;
}

export const TodoFooter: FC<Props> = ({
  leftTodos,
  statusFilter,
  onChangeStatusFilter,
  todosAmount,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {leftTodos} items left
    </span>

    <TodoFilter
      statusFilter={statusFilter}
      onChangeStatusFilter={onChangeStatusFilter}
    />

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={leftTodos === todosAmount}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
