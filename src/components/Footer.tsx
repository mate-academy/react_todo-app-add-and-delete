import classNames from 'classnames';
import { TodoFilter } from '../enums/TodoFilter.enum';
import { Todo } from '../types/Todo';

type FooterProps = {
  todos: Todo[];
  filterStatus: TodoFilter;
  setFilterStatus: (filter: TodoFilter) => void;
  resolveTodos: () => void;
};

const filters = [
  { name: 'All', value: TodoFilter.All },
  { name: 'Active', value: TodoFilter.Active },
  { name: 'Completed', value: TodoFilter.Completed },
];

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterStatus,
  setFilterStatus,
  resolveTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={`#${filter.value}`}
            className={classNames('filter__link', {
              selected: filterStatus === filter.value,
            })}
            onClick={event => {
              event.preventDefault();
              setFilterStatus(filter.value);
            }}
            data-cy={`FilterLink${filter.name}`}
          >
            {filter.name}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(todo => todo.completed === true).length === 0}
        onClick={resolveTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
