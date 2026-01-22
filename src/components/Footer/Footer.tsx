/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  status: string;
  onStatusChange: (status: string) => void;
  todos: Todo[];
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  onStatusChange,
  status,
  todos,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && !(todo as any).isTemp,
  ).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            onStatusChange('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            onStatusChange('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            onStatusChange('completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
