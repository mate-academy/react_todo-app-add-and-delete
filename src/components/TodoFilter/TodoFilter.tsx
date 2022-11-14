import React, { SetStateAction } from 'react';
import classNames from 'classnames';
import { Types } from '../../types/Types';

type Props = {
  setFilter: React.Dispatch<SetStateAction<string>>;
  filters: Types;
  activeTodosLength: number;
  filter: string;
  haveCompleted: boolean;
};

export const TodoFilter: React.FC<Props> = ({
  setFilter,
  filters,
  activeTodosLength,
  filter,
  haveCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filter === filters.all })}
          onClick={() => setFilter(filters.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === filters.active })}
          onClick={() => setFilter(filters.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === filters.completed })}
          onClick={() => setFilter(filters.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !haveCompleted,
        })}
      >
        Clear completed
      </button>
    </footer>
  );
};
