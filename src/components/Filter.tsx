import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filterBy: string;
  setFilterBy: (param: string) => void;
  filteredTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  filteredTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filteredTodos.length} items left`}
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterBy === 'all' })}
          onClick={() => setFilterBy('all')}

        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterBy === 'active' })}
          onClick={() => setFilterBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterBy === 'completed' })}
          onClick={() => setFilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
