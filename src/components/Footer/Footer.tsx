import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  completeTodosLength: number,
  incompleteTodos: Todo[],
  completedFilter: Filter,
  setCompletedFilter: React.Dispatch<React.SetStateAction<Filter>>,
  handleClearCompleted: () => void,
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    completeTodosLength,
    incompleteTodos,
    completedFilter,
    setCompletedFilter,
    handleClearCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${incompleteTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: completedFilter === Filter.all,
          })}
          onClick={() => setCompletedFilter(Filter.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: completedFilter === Filter.active,
          })}
          onClick={() => setCompletedFilter(Filter.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: completedFilter === Filter.completed,
          })}
          onClick={() => setCompletedFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      {completeTodosLength !== 0 && (
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
