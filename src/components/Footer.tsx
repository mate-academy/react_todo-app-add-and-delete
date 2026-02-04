import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  count: number;
  handleStatusChange: (newStatus: Filter) => void;
  status: Filter;
  clearCompleted: () => void;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  count,
  handleStatusChange,
  status,
  clearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter === Filter.All ? '' : filter}`}
            className={classNames('filter__link', {
              selected: status === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={() => handleStatusChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
