import classNames from 'classnames';
import { Todo } from '../types/Todo';

export type Status = 'all' | 'active' | 'completed';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  onClearCompleted: () => void;
};

export const ToDoFooter: React.FC<Props> = ({
  todos, setStatus, status, onClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span
        className="todo-count"
      >
        {`${activeTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === 'all',
          })}
          onClick={() => setStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === 'active',
          })}
          onClick={() => setStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === 'completed',
          })}
          onClick={() => setStatus('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        style={{
          visibility: completedTodos.length
            ? ('visible')
            : ('hidden'),
        }}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
