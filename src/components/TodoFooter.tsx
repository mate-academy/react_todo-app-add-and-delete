import { FilterStatus } from '../types/FilterStatus';
import { TodoFilter } from './TodoFilter';

type Props = {
  todosLeft: number;
  hasCompletedTodos: boolean;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosLeft,
  hasCompletedTodos,
  filterStatus,
  onFilterChange,
  onClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <TodoFilter filterStatus={filterStatus} onFilterChange={onFilterChange} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
