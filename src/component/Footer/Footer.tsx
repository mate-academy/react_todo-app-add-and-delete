import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/typedefs';

interface Props {
  todos: FilterBy,
  itemsCount: number,
  onSelect: (filterTodos: FilterBy) => void;
}

export const Footer: React.FC<Props> = ({
  todos: filterTodos,
  itemsCount: itemsLeft,
  onSelect: onfilterTodos,
}) => {
  return (
    itemsLeft > 0 ? (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${itemsLeft} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.ALL,
            })}
            onClick={() => onfilterTodos(FilterBy.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.ACTIVE,
            })}
            onClick={() => onfilterTodos(FilterBy.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.COMPLETED,
            })}
            onClick={() => onfilterTodos(FilterBy.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      </footer>
    )
      : (<></>)
  );
};
