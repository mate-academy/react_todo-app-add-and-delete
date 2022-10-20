import React from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/SortType';

type Props = {
  todosCount: number;
  todosLeft: number;
  filterType: SortType;
  setFilterType: (type: SortType) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  todosCount, todosLeft, filterType, setFilterType, clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${todosLeft} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filterType === 'all',
          },
        )}
        onClick={() => setFilterType('all')}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filterType === 'active',
          },
        )}
        onClick={() => setFilterType('active')}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filterType === 'completed',
          },
        )}
        onClick={() => setFilterType('completed')}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={clearCompleted}
      disabled={todosCount === todosLeft}
    >
      Clear completed
    </button>
  </footer>
));
