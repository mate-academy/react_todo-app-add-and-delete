import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';
import { filterTodos } from '../../utils/helpers';

interface Props {
  filterType: FilterType,
  onFilterSelect: (filterT: FilterType) => void,
  todos: Todo[],
  clearCompleted: () => void
}

export const Footer: React.FC<Props> = ({
  filterType,
  onFilterSelect,
  todos,
  clearCompleted,
}) => {
  const todosToComplete = filterTodos(todos, FilterType.Active).length;
  const isClearButtonShown = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosToComplete} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterSelect(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterSelect(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterSelect(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {
        isClearButtonShown
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => clearCompleted()}
          >
            Clear completed
          </button>
        )

      }

    </footer>
  );
};
