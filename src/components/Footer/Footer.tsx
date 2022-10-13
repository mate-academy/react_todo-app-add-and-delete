import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterValues } from '../../types/FilterValues';

type Props = {
  todos: Todo[],
  filterTodos: (value: string) => void;
  countActive: number;
  filterValue: FilterValues;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterTodos, countActive, filterValue, clearCompleted, todos,
}) => {
  const { All, Active, Completed } = FilterValues;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    filterTodos((e.target as HTMLAnchorElement).text);
  };

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
          onClick={handleClick}
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
          onClick={handleClick}
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
          onClick={handleClick}
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
