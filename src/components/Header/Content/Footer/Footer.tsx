import cn from 'classnames';
import { useContext } from 'react';
import { Status } from '../../../../types/Status';
import { TodosContext } from '../../../../Context/TodosContext';
import { Todo } from '../../../../types/Todo';

export const Footer: React.FC = () => {
  const {
    todos,
    handleStatus,
    status,
    handleDeleteCompleted,
  } = useContext(TodosContext);

  const leftTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);

  const clearButton = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${leftTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        style={{ visibility: clearButton ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
