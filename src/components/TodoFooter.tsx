import { FilterStatus } from '../types/FilterStatus';
import { TodoFilter } from './TodoFilter';

type Props = {
  todosLeft: number;
  isHasCompletedTodos: boolean;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosLeft,
  isHasCompletedTodos,
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
        disabled={!isHasCompletedTodos}
        onClick={onClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
