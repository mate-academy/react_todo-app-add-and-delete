import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filters } from './types/Filters';

type Props = {
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  todos,
  filterSelected,
  setFilterSelected,
  handleDelete,
}) => {
  const remainingTodosCount = todos.filter(todo => !todo.completed).length;

  const filterOptions: Filters[] = Object.values(Filters) as Filters[];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map((filter: Filters) => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterSelected === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterSelected(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={() => {
          todos
            .filter(todo => todo.completed)
            .forEach(todo => handleDelete(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
