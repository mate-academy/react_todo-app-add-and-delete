import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { SortType } from '../../types/SortType';

type Props = {
  todos: Todo[],
  changeSelectFilter: (sortType: SortType) => void,
  selectFilter: string,
};

export const Footer: React.FC<Props> = (
  {
    todos,
    changeSelectFilter,
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
          onClick={() => changeSelectFilter(SortType.All)}
          href="#/"
          className={cn('filter__link',
            { selected: selectFilter === SortType.All })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => changeSelectFilter(SortType.Active)}
          href="#/active"
          className={cn('filter__link',
            { selected: selectFilter === SortType.Active })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => changeSelectFilter(SortType.Completed)}
          href="#/completed"
          className={cn('filter__link',
            { selected: selectFilter === SortType.Completed })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        disabled={!clearCompleteStatusButton}
        type="button"
        className={cn('todoapp__clear-completed', {})}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
