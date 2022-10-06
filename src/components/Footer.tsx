import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  setFilterBy: (param: string) => void;
  filterBy: string;
  filteredTodos: Todo[];
  handleDeleteCompletedTodos: () => void;
  completedTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  filteredTodos,
  handleDeleteCompletedTodos,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filteredTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
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
        onClick={handleDeleteCompletedTodos}
      >
        {completedTodos.length > 0 && ('Clear completed')}
      </button>
    </footer>
  );
};
