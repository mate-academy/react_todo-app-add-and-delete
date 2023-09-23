import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { SortType } from '../../types/SortType';

type Props = {
  todos: Todo[],
  setSelectFilter: (value: SortType) => void,
  selectFilter: SortType,
};

export const Footer: React.FC<Props> = (
  {
    todos,
    setSelectFilter,
    selectFilter,
  },
) => {
  const clearCompleteStatusButton = todos.some((todo) => todo.completed);

  const itemsLeftCounter = todos.reduce((acc, todo) => {
    const { completed } = todo;

    if (!completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeftCounter} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => setSelectFilter(SortType.All)}
          href="#/"
          className={cn('filter__link',
            { selected: selectFilter === SortType.All })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => setSelectFilter(SortType.Active)}
          href="#/active"
          className={cn('filter__link',
            { selected: selectFilter === SortType.Active })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => setSelectFilter(SortType.Completed)}
          href="#/completed"
          className={cn('filter__link',
            { selected: selectFilter === SortType.Completed })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <div>
        {clearCompleteStatusButton && (
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};
