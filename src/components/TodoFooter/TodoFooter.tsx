import React from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../context/TodoContext';

export const TodoFooter = React.memo(() => {
  const {
    removeAllCompleted, nrOfActiveTodos, setFilter, filter, completedTodosId,
  } = useTodoContext();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {nrOfActiveTodos}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'all' })}
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'active' })}
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'completed' })}
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {/* {completedTodosId.length > 0 && ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeAllCompleted}
        disabled={!(completedTodosId.length > 0)}
      >
        Clear completed
      </button>
      {/* )} */}
    </footer>
  );
});
