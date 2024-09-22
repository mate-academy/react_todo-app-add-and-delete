import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filterValue: Filter) => void;
  hasCompleted: boolean;
  onClick: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  hasCompleted,
  onClick,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`}
            onClick={() => onFilterChange(filterValue)}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
