import classNames from 'classnames';
import React from 'react';
import { SortType } from '../types/SortType';
import { Todo } from '../types/Todo';

interface Props {
  active: Todo[];
  completed: Todo[];
  setSortBy: (sorted: SortType) => void;
  sortBy: SortType;
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  active, completed, setSortBy, sortBy, deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortType.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setSortBy(SortType.All)}
        >
          {SortType.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortType.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setSortBy(SortType.Active)}
        >
          {SortType.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortBy === SortType.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortBy(SortType.Completed)}

        >
          {SortType.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !!completed.length,
        })}
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
