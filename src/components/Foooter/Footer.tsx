import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  clearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const countOfActive = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countOfActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterType === 'All',
          })}
          onClick={() => setFilterType('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === 'Active',
          })}
          onClick={() => setFilterType('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === 'Completed',
          })}
          onClick={() => setFilterType('Completed')}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
