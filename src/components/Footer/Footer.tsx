import { Filter } from '../../types/Filter';
import { TodoFilter } from '../TodoFilter/TodoFilter';

type Props = {
  filterStatus: Filter;
  activeTodosCount: number;
  hasCompletedTodo: boolean;
  onFilterChange: (status: Filter) => void;
  clearAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  hasCompletedTodo,
  activeTodosCount,
  onFilterChange,
  clearAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <TodoFilter
        status={filterStatus}
        onChange={onFilterChange}
        hasCompletedTodo={hasCompletedTodo}
        clearAllCompleted={clearAllCompleted}
      />
    </footer>
  );
};
