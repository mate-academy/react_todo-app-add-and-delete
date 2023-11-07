import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  setFiltredByStatus: (value: Status) => void;
  filtredByStatus: Status;
};

export const Footer: React.FC<Props> = ({
  todos,
  setFiltredByStatus,
  filtredByStatus,
}) => {
  const itemsLeft = todos
    .filter((todo) => todo.completed === false)
    .length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        { `${itemsLeft} items left` }
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filtredByStatus === Status.all
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setFiltredByStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filtredByStatus === Status.active
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFiltredByStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filtredByStatus === Status.completed
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltredByStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
