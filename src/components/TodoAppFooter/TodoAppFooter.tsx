import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  currentFilter: FilterBy;
  onfilterChange: (newFilter: FilterBy) => void;
  onClearCompleted: () => void;
};

export const TodoAppFooter: React.FC<Props> = React.memo(
  ({ todos, currentFilter, onfilterChange, onClearCompleted }) => {
    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    const hasSomeCompleted = todos.some(todo => todo.completed);

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: currentFilter === FilterBy.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onfilterChange(FilterBy.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: currentFilter === FilterBy.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onfilterChange(FilterBy.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: currentFilter === FilterBy.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onfilterChange(FilterBy.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!hasSomeCompleted}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

TodoAppFooter.displayName = 'TodoAppFooter';
