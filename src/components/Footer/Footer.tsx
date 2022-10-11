/* eslint-disable no-console */
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterTodos: (value: string) => void;
  countActive: number;
  filterValue: string;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterTodos, countActive, filterValue, clearCompleted, todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={`filter__link ${filterValue === 'All' && 'selected'}`}
          onClick={(e) => {
            filterTodos((e.target as HTMLAnchorElement).text);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={`filter__link ${filterValue === 'Active' && 'selected'}`}
          onClick={(e) => {
            filterTodos((e.target as HTMLAnchorElement).text);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={`filter__link ${filterValue === 'Completed' && 'selected'}`}
          onClick={(e) => {
            filterTodos((e.target as HTMLAnchorElement).text);
          }}
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
