import { FilterButtons } from '../types/FilterType';
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: FilterButtons;
  setFilter: (filter: FilterButtons) => void;
  todosCounter: string;
  deletedAllCompleted: () => void;
};

export const TodoFooter = ({
  todos,
  filter,
  setFilter,
  todosCounter,
  deletedAllCompleted,
}: Props) => {
  const onlyActiveTodos = todos.filter(todo => !todo.completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <>
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FilterButtons.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterButtons.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FilterButtons.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterButtons.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FilterButtons.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterButtons.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => deletedAllCompleted()}
              disabled={todos.length === onlyActiveTodos.length}
            >
              Clear completed
            </button>
          </>
        </footer>
      )}
    </>
  );
};
