import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

type Props = {
  activeCount: number;
  currentFilter: Filter;
  setFilterStatus: React.Dispatch<React.SetStateAction<Filter>>;
  hasCompletedTodo: boolean;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  currentFilter,
  setFilterStatus,
  hasCompletedTodo,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(status => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: currentFilter === status,
            })}
            data-cy={
              status === Filter.All
                ? 'FilterLinkAll'
                : status === Filter.Active
                  ? 'FilterLinkActive'
                  : 'FilterLinkCompleted'
            }
            onClick={() => setFilterStatus(status)}
            key={status}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
