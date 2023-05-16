import cn from 'classnames';
import { Filter } from '../../utils/Filter';
import { TodoFilter } from '../TodoFilter/TodoFilter';

interface Props {
  onFilterChange: (filter: Filter) => void;
  selectedFilter: Filter;
  activeTodosCount: number;
  isCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  onFilterChange,
  selectedFilter,
  activeTodosCount,
  isCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <TodoFilter
        onFilterChange={onFilterChange}
        selectedFilter={selectedFilter}
      />

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !isCompleted,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
