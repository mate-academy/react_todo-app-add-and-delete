import React from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  sortMethods: string[],
  sortType: SortType,
  filterChange: (
    methodSort: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,) => void,
  clearCompletedTodos: () => void

}

export const Footer: React.FC<Props> = ({
  todos,
  sortMethods,
  sortType,
  filterChange,
  clearCompletedTodos,
}) => {
  const noCompletedTodos = () => {
    return todos.some(todo => todo.completed);
  };

  return (
    <>
      {todos.length !== 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            3 items left
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            {sortMethods.map(method => (
              <a
                key={method}
                href={`#/${method}`}
                className={classNames(
                  'filter__link',
                  { selected: sortType === method },
                )}
                onClick={(event) => filterChange(method, event)}
              >
                {method}
              </a>
            ))}
          </nav>

          {/* don't show this button if there are no completed todos */}
          {noCompletedTodos() && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={() => clearCompletedTodos()}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
