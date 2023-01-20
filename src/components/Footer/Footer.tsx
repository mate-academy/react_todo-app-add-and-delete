import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  completeTodos: Todo[],
  incompleteTodos: Todo[],
  filter: string,
  setFilter: React.Dispatch<React.SetStateAction<string>>,
};

export const Footer: React.FC<Props> = (props) => {
  const {
    completeTodos,
    incompleteTodos,
    filter,
    setFilter,
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
            selected: filter === 'All',
          })}
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'Active',
          })}
          onClick={() => setFilter('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'Completed',
          })}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {completeTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
