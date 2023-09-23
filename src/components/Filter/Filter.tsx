import { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../providers/TodosProvider/TodosProvider';

export const Filter = () => {
  const todosContext = useContext(TodosContext);

  if (!todosContext) {
    return null;
  }

  const { todos, handleFilter, filter } = todosContext;

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => todo.completed === false).length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.every(todo => todo.completed === false)}
        style={todos.every(todo => todo.completed === false)
          ? { visibility: 'hidden' }
          : {}}
      >
        Clear completed
      </button>

    </footer>
  );
};
