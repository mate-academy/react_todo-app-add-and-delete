import cn from 'classnames';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

const TODO_FILTERS: Record<TodoStatusFilter, string> = {
  [TodoStatusFilter.all]: 'All',
  [TodoStatusFilter.completed]: 'Completed',
  [TodoStatusFilter.active]: 'Active',
};

type TodoFilterProps = {
  status: TodoStatusFilter;
  onStatusChange: (status: TodoStatusFilter) => void;
};

export const TodoFilter: React.FC<TodoFilterProps> = ({
  status,
  onStatusChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(TodoStatusFilter).map(([key, value]) => (
        <a
          key={key}
          href={`#/${key}`}
          className={cn('filter__link', { selected: status === value })}
          data-cy={`FilterLink${TODO_FILTERS[value]}`}
          onClick={() => onStatusChange(value)}
        >
          {value}
        </a>
      ))}
    </nav>
  );
};
