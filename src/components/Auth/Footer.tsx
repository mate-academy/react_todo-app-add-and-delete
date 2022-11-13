import React from 'react';
import cn from 'classnames';
import { FilterTodos } from '../../utils/FilterTodos';

type Props = {
  activeTodos: number;
  filterBy: FilterTodos;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterTodos>>;
  deleteCompleted: () => void;
  completedTodos: number;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterBy,
  setFilterBy,
  deleteCompleted,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterTodos.ALL,
          })}
          onClick={() => setFilterBy(FilterTodos.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterTodos.ACTIVE,
          })}
          onClick={() => setFilterBy(FilterTodos.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterTodos.COMLETED,
          })}
          onClick={() => setFilterBy(FilterTodos.COMLETED)}
        >
          Completed
        </a>
      </nav>
      {!completedTodos || (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
