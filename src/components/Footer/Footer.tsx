import { FC, SetStateAction } from 'react';
import { StatusSelect, Todo } from '../../types/Todo';

export interface IFooter {
  setStatus: React.Dispatch<SetStateAction<StatusSelect>>;
  status: StatusSelect;
  todos: Todo[];
}

export const Footer: FC<IFooter> = ({ setStatus, status, todos }) => {
  const activeTodo = todos.reduce(
    (acc, current) => (current.completed ? acc : acc + 1),
    0,
  );

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${
            status === StatusSelect.All ? 'selected' : ''
          }`}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(StatusSelect.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            status === StatusSelect.Active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(StatusSelect.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            status === StatusSelect.Completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(StatusSelect.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
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
