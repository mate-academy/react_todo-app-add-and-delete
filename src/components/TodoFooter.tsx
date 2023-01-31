import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../helpers/filterTodos';

type Props = {
  activeTodos: Todo[],
  completeTodosCount: number,
  filterOption: Filter,
  setFilterOption: React.Dispatch<React.SetStateAction<Filter>>,
  handleClearCompleted: () => void,
};

export const TodoFooter: React.FC<Props> = memo(({
  activeTodos,
  filterOption,
  setFilterOption,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterOption === Filter.all,
          })}
          onClick={() => setFilterOption(Filter.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterOption === Filter.active,
          })}
          onClick={() => setFilterOption(Filter.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterOption === Filter.completed,
          })}
          onClick={() => setFilterOption(Filter.completed)}
        >
          Completed
        </a>
      </nav>
      {activeTodos.length !== 0
        && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        )}
    </footer>
  );
});
