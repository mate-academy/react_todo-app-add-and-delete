import { Dispatch } from 'react';
import { StatusFilter } from '../StatusFilter/StatusFilter';
import { StatusFilterOptions } from '../../types/StatusFilterOptions';

interface FooterProps {
  activeTodos: number;
  statusFilter: StatusFilterOptions;
  setStatusFilter: Dispatch<React.SetStateAction<StatusFilterOptions>>;
  isCompletedTodos: boolean;
  handleDeleteAllCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodos,
  statusFilter,
  setStatusFilter,
  isCompletedTodos,
  handleDeleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <StatusFilter
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={handleDeleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
