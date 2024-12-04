import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import { FilterParam } from '../../App';

type Props = {
  filter: string;
  setFilter: (a: Filter) => void;
  todos: Todo[];
  handleDeleteTodo: (a: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  handleDeleteTodo,
}) => {
  const handleFilter = (event: React.MouseEvent<HTMLElement>) => {
    const filterValue = event.currentTarget.textContent as Filter;

    setFilter(filterValue);
  };

  const handleClearComplete = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo =>
      handleDeleteTodo(todo.id),
    );

    Promise.allSettled(deletePromises);
  };

  const amountActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterParam).map(param => (
          <a
            key={param}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === param,
            })}
            data-cy={`FilterLink${param}`}
            onClick={handleFilter}
          >
            {param}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
