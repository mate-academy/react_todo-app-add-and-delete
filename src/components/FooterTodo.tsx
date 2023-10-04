import cn from 'classnames';
import { useMemo } from 'react';
import { useTodo } from '../providers/AppProvider';

export const FooterTodo = () => {
  const { todos, filterBy, setFilterBy } = useTodo();
  const counter = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos, todos.length]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counter} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn('todoapp__clear-completed', {
        })}
        disabled={!todos.some(todo => todo.completed === true)}
        data-cy="ClearCompletedButton"

      >
        Clear completed
      </button>
    </footer>
  );
};
