import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  filter: string;
  setFilter: (status: FilterStatus) => void;
  todos: Todo[];
  handleClearComplete: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  handleClearComplete,
}) => {
  const activeTodosFiltered = todos.filter((todo: Todo) => !todo.completed);
  const completedTodosFiltered = todos.filter((todo: Todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosFiltered.length} ${activeTodosFiltered.length === 1 ? 'item' : 'items'} left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map((status: FilterStatus) => (
          <a
            key={status}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosFiltered.length}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
