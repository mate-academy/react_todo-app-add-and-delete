import React from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/Context';
import { Filter } from '../types/Filter';

export const Footer: React.FC = () => {
  const {
    state: { todos, filter },
    setFilter,
    setTodos,
  } = useAppContext();

  const completed = todos.filter(todo => todo.completed);
  const notComleted = todos.filter(todo => !todo.completed);

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {notComleted.length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filter === Filter.All,
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilter(Filter.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filter === Filter.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilter(Filter.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filter === Filter.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter(Filter.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => setTodos(notComleted)}
            disabled={!completed.length}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
