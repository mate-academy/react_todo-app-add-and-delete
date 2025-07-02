import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../App';

type Props = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  countActiveTodos: number;
  countCompletedTodos: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  countActiveTodos,
  countCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => {
          return (
            <a
              key={type}
              href="#/"
              className={classNames('filter__link', {
                selected: filter === type,
              })}
              data-cy={`FilterLink${type.charAt(0).toUpperCase()}${type.slice(1)}`}
              onClick={e => {
                e.preventDefault();
                setFilter(type);
              }}
            >
              {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={countCompletedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
