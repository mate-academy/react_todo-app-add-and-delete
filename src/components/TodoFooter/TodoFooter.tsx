import cn from 'classnames';

type Props = {
  filterCompleted: boolean | null;
  onCompleted: (filter: boolean | null) => void;
  activeTodosCount: number;
  onDeleteAllTodos: () => Promise<void>;
  completedTodos: number;
};

export function TodoFooter({
  filterCompleted,
  onCompleted,
  activeTodosCount,
  onDeleteAllTodos,
  completedTodos,
}: Props) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterCompleted === null,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onCompleted(null)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterCompleted === false,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onCompleted(false)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterCompleted === true,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onCompleted(true)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAllTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
}
