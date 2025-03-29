import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  setFilterStatus: (value: FilterStatus) => void;
  filterStatus: FilterStatus;
  filteredTodos: Todo[];
  todos: Todo[];
  deleteAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  setFilterStatus,
  filterStatus,
  filteredTodos,
  todos,
  deleteAllCompletedTodos,
}) => {
  const activeTodosCounter = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = filteredTodos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: filterStatus === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilterStatus(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
