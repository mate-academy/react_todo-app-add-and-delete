import { useCallback } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type IsCompleted = 'all' | 'active' | 'completed';
interface P {
  todos: Todo[];
  setCompletedFilter: (filter: IsCompleted) => void;
  completedFilter: IsCompleted;
}

export const Footer: React.FC<P> = ({
  todos,
  setCompletedFilter,
  completedFilter,
}) => {
  const countActiveTodos = useCallback(() => {
    return todos
      .filter(todo => !todo.completed)
      .length;
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {countActiveTodos()}
        &nbsp;items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          onClick={() => setCompletedFilter('all')}
          className={classNames('filter__link', {
            selected: (completedFilter === 'all'),
          })}
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setCompletedFilter('active')}
          className={classNames('filter__link', {
            selected: (completedFilter === 'active'),
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setCompletedFilter('completed')}
          className={classNames('filter__link', {
            selected: (completedFilter === 'completed'),
          })}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
