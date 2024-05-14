import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  sortField: SortType;
  setSortField: (field: SortType) => void;
  todos: Todo[];
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  sortField,
  setSortField,
  todos,
  clearCompleted,
}) => {
  const oneTodoCompleted = todos.some(todo => todo.completed);

  const activeTodos = todos.reduce(
    (acc, todo) => (todo.completed ? acc : acc + 1),
    0,
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${sortField === SortType.All && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={() => setSortField(SortType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${sortField === SortType.Active && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={() => setSortField(SortType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${sortField === SortType.Completed && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortField(SortType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        onClick={clearCompleted}
        disabled={!oneTodoCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
