import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  onSetFilterType: React.Dispatch<Filter>,
  onDeleteCompletedTodos: () => void,
  activeTodos: number,
  completedTodos: number,
  filterType: Filter,
};

export const Footer: React.FC<Props> = ({
  onSetFilterType,
  onDeleteCompletedTodos,
  activeTodos,
  completedTodos,
  filterType,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href={`#/${Filter.all}`}
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.all },
          )}
          onClick={() => onSetFilterType(Filter.all)}
        >
          {Filter.all}
        </a>

        <a
          data-cy="FilterLinkActive"
          href={`#/${Filter.active}`}
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.active },
          )}
          onClick={() => onSetFilterType(Filter.active)}
        >
          {Filter.active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href={`#/${Filter.completed}`}
          className={classNames(
            'filter__link',
            { selected: filterType === Filter.completed },
          )}
          onClick={() => onSetFilterType(Filter.completed)}
        >
          {Filter.completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
