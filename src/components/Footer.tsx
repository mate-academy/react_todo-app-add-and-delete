import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  filterTodos: (filter: Status) => void,
  isCompleted: boolean,
  todos: Todo[],
  handleClearCompleted: () => void,
  filter: Status,
};

export const Footer: React.FC<Props> = ({
  filterTodos,
  isCompleted,
  todos,
  handleClearCompleted,
  filter,
}) => {
  return (
    <>
      {/* Hide the footer if there are no todos */}
      {todos && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todos.filter(todo => !todo.completed).length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filter === Status.All },
              )}
              data-cy="FilterLinkAll"
              onClick={() => filterTodos(Status.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filter === Status.Active },
              )}
              data-cy="FilterLinkActive"
              onClick={() => filterTodos(Status.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filter === Status.Completed },
              )}
              data-cy="FilterLinkCompleted"
              onClick={() => filterTodos(Status.Completed)}
            >
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          {isCompleted && (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
