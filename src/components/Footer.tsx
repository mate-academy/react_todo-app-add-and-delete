import React from 'react';
import classNames from 'classnames';
import { useTodos } from '../hooks/useTodos';
import { SortType } from '../types/SortType';

export const Footer: React.FC = () => {
  const { todos, sortQuery, setSortQuery } = useTodos();

  const notCompletedTodosLength = todos?.filter(todo => (
    !todo.completed
  )).length;

  const completedTodosLength = todos?.filter(todo => (todo.completed)).length;

  return (
    <>
      {!!todos?.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${notCompletedTodosLength} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                {
                  selected: sortQuery === SortType.All,
                },
              )}
              data-cy="FilterLinkAll"
              onClick={() => setSortQuery(SortType.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                {
                  selected: sortQuery === SortType.Active,
                },
              )}
              data-cy="FilterLinkActive"
              onClick={() => setSortQuery(SortType.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                {
                  selected: sortQuery === SortType.Completed,
                },
              )}
              data-cy="FilterLinkCompleted"
              onClick={() => setSortQuery(SortType.Completed)}
            >
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          {!!completedTodosLength && (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
