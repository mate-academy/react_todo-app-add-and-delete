import cn from 'classnames';
import { useTodos } from '../../context/TodosContext';
import { Status } from '../../types/Status';

export const TodoFilter: React.FC = () => {
  const { filterStatus, handleFilterTodo } = useTodos();

  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(Status).map(([key, value]) => (
        <a
          onClick={() => handleFilterTodo(value)}
          href={value}
          key={key}
          className={cn('filter__link', {
            selected: filterStatus === value,
          })}
          data-cy={`FilterLink${key}`}
        >
          {key}
        </a>
      ))}
    </nav>
  );
};
