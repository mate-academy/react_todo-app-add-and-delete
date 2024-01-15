import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

interface Props {
  onStatus: (value: string) => void
  status: string,
  todos: Todo[],
  handleClearCompleted: () => void
}

export const Footer: React.FC<Props> = ({
  handleClearCompleted,
  onStatus,
  status,
  todos,
}) => {
  const noComplitedTodos = todos.filter(
    todo => !todo.completed,
  );

  const disable = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${noComplitedTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All
          || status === '',
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatus('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onStatus('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatus('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!disable}
      >
        Clear completed
      </button>
    </footer>
  );
};
