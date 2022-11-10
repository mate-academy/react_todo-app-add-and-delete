import React from 'react';
import classNames from 'classnames';

type Props = {
  activeTodosTotal: number,
  isLeftActiveTodos: boolean,
  filterValue: string,
  setFilterValue: (value: string) => void,
  completedTodosIds: number[],
  onDelete: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosTotal,
  isLeftActiveTodos,
  filterValue,
  setFilterValue,
  completedTodosIds,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosTotal} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'all' },
          )}
          onClick={() => setFilterValue('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'active' },
          )}
          onClick={() => setFilterValue('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'completed' },
          )}
          onClick={() => setFilterValue('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => onDelete(completedTodosIds)}
      >
        {!isLeftActiveTodos && 'Clear completed'}
      </button>
    </footer>
  );
};
