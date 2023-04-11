import React from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { SortType } from '../../types/SortType';

interface Props {
  todos: Todo[],
  filteredTodos: Todo[],
  sortType: SortType,
  onSelect: (typeOfSort: SortType) => void,
}

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    todos,
    filteredTodos,
    sortType,
    onSelect,
  } = props;

  const handlerSortSelect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.target as HTMLAnchorElement;
    const typeOfSort = target.getAttribute('data-sort') as SortType;

    if (typeOfSort === sortType) {
      return;
    }

    onSelect(typeOfSort);
  };

  const hasTodos = filteredTodos.length > 0;

  return (
    <>
      {hasTodos && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todos.length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                {
                  selected: sortType === SortType.ALL,
                },
              )}
              data-sort="all"
              onClick={handlerSortSelect}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                {
                  selected: sortType === SortType.ACTIVE,
                },
              )}
              data-sort="active"
              onClick={handlerSortSelect}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                {
                  selected: sortType === SortType.COMPLETED,
                },
              )}
              data-sort="completed"
              onClick={handlerSortSelect}
            >
              Completed
            </a>
          </nav>

          {todos.some(todo => todo.completed) && (
            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
