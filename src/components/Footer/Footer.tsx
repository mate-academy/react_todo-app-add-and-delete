import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  itemsLeft: Todo[];
  selectFilter: string;
  setSelectFilter: (str: string) => void
  allCompleted: Todo[];
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  selectFilter,
  setSelectFilter,
  allCompleted,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectFilter === 'all' },
          )}
          onClick={() => setSelectFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectFilter === 'active' },
          )}
          onClick={() => setSelectFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectFilter === 'completed' },
          )}
          onClick={() => setSelectFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {allCompleted.length !== 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      ) : ''}
    </footer>
  );
};
