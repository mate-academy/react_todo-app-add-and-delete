import classNames from 'classnames';
import { Todo } from '../types/Todo';

enum StatusFilter {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

type Props = {
  status: string,
  setStatus: React.Dispatch<React.SetStateAction<StatusFilter>>,
  todos: Todo[],
  clearCompleted: () => void,
};

export const Footer:React.FC<Props> = ({
  status,
  setStatus,
  todos,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === StatusFilter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={(event) => {
            event.preventDefault();
            setStatus(StatusFilter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === StatusFilter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={(event) => {
            event.preventDefault();
            setStatus(StatusFilter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === StatusFilter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={(event) => {
            event.preventDefault();
            setStatus(StatusFilter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
