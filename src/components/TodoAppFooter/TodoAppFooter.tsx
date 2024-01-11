import React from 'react';
import cn from 'classnames';
import { FilterLink } from '../../utils/TodoFilter';

type Props = {
  setSelectedFilter: (value: FilterLink) => void;
  selectedFilter: FilterLink;
  todosCounter: number;
  completedSum: number;
  deleteAllComleted: () => void;
};

export const TodoAppFooter: React.FC<Props> = ({
  selectedFilter,
  setSelectedFilter,
  todosCounter,
  completedSum,
  deleteAllComleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${todosCounter} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterLink).map(([key, value]) => (
        <a
          key={key}
          href={`#/${value}`}
          className={cn('filter__link', {
            selected: value === selectedFilter,
          })}
          data-cy={`FilterLink${key}`}
          onClick={() => setSelectedFilter(value)}
        >
          {key}
        </a>
      ))}
    </nav>

    {/* don't show this button if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedSum === 0}
      onClick={deleteAllComleted}
    >
      Clear completed
    </button>
  </footer>
);
