import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterValues } from '../../types/FilterValues';

type Props = {
  todos: Todo[],
  filterTodos: (value: FilterValues) => void;
  countActive: number;
  filterValue: FilterValues;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterTodos, countActive, filterValue, clearCompleted, todos,
}) => {
  const { All, Active, Completed } = FilterValues;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterValue === All },
          )}
          onClick={() => filterTodos(FilterValues.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterValue === Active },
          )}
          onClick={() => filterTodos(FilterValues.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterValue === Completed },
          )}
          onClick={() => filterTodos(FilterValues.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          clearCompleted();
        }}
        disabled={countActive === todos.length}
        style={countActive === todos.length
          ? { opacity: 0 }
          : { opacity: 1 }}
      >
        Clear completed
      </button>
    </footer>
  );
};
