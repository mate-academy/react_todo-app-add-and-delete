import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  itemsLeft: number,
  completedTodos: number,
  filter: Filter,
  handleFilterClick: (value: Filter) => void,
  handleClearCompletedClick: () => void,
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  completedTodos,
  filter,
  handleFilterClick,
  handleClearCompletedClick,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === 'all' },
          )}
          onClick={() => handleFilterClick('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === 'active' },
          )}
          onClick={() => handleFilterClick('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === 'completed' },
          )}
          onClick={() => handleFilterClick('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        onClick={() => handleClearCompletedClick()}
      >
        Clear completed
      </button>
    </footer>
  );
};
