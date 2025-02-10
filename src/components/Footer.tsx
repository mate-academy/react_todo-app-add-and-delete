import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  activeFilter: FilterType;
  handleFilter: (filter: FilterType) => void;
  todos: Todo[] | null;
  filteredTodos: Todo[];
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeFilter,
  handleFilter,
  todos,
  filteredTodos,
  handleDeleteCompleted,
}) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {(todos ?? []).filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: activeFilter === FilterType.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleFilter(FilterType.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: activeFilter === FilterType.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => handleFilter(FilterType.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: activeFilter === FilterType.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => handleFilter(FilterType.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
          disabled={
            (filteredTodos ?? []).filter(todo => todo.completed).length === 0
          }
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
