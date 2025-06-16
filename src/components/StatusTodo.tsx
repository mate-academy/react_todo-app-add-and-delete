import cn from 'classnames';
import { TodoFilters } from '../types/TodoFilters';

type StatusTodoProps = {
  todoFilter: TodoFilters;
  onTodoFilter: (val: TodoFilters) => void;
};

export const StatusTodo = ({ todoFilter, onTodoFilter }: StatusTodoProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(TodoFilters).map(([text, value]) => (
        <a
          key={value}
          href={`#/${value !== 'all' ? value : ''} `}
          className={cn('filter__link', {
            'filter__link selected': todoFilter === value,
          })}
          data-cy={`FilterLink${text}`}
          onClick={() => onTodoFilter(value)}
        >
          {text}
        </a>
      ))}
    </nav>
  );
};
