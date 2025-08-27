import cls from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type FilterProps = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  onClearCompleted: () => void; // Add this prop
};

{
  /* Hide the footer if there are no todos */
}

export const Filter: React.FC<FilterProps> = ({
  todos,
  status,
  setStatus,
  onClearCompleted,
}) => {
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const todosLeft = todos.length - completedTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} item{todos.length !== 1 ? 's' : ''} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cls('filter__link', { selected: status === 'all' })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            setStatus('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cls('filter__link', { selected: status === 'active' })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setStatus('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cls('filter__link', { selected: status === 'completed' })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setStatus('completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
