import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/Filtertype';
import { Todo } from '../../types/Todo';

type Props = {
  todoItemLeft: number;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  clearCompleted: () => void;
  complitedTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  todoItemLeft,
  filterType,
  setFilterType,
  clearCompleted,
  complitedTodos,
}) => {
  return (

    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todoItemLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: FilterType.all === filterType })}
          onClick={() => setFilterType(FilterType.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: FilterType.active === filterType })}
          onClick={() => setFilterType(FilterType.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: FilterType.completed === filterType })}
          onClick={() => setFilterType(FilterType.completed)}
        >
          Completed
        </a>
      </nav>

      {complitedTodos.length > 0 && (
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
