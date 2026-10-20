import React from 'react';
import { Status } from '../types/Status';
import { Filter } from './Filter';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  status,
  onStatusChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <Filter status={status} onStatusChange={onStatusChange} />

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
