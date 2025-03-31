import { FC } from 'react';
import { FilterStatus } from '../utils/FilterStatus';
import { Todo } from '../types/Todo';

import cn from 'classnames';

type Props = {
  setFilter: (filter: FilterStatus) => void;
  filter: FilterStatus;
  todos: Todo[];
  handleDeleteCompleted: () => void;
};

export const Footer: FC<Props> = ({
  setFilter,
  filter,
  todos,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterStatus.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterStatus.Completed)}
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
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
