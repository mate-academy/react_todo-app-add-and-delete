import React from 'react';
import classNames from 'classnames';
import { MainFilter } from '../../types/MainFilter';

type Props = {
  filterOption: MainFilter;
  setFilterOption: (filterType: MainFilter) => void
  numberOfActiveTodos: number;
  numberOfCompletedTodos: number;
  onClearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterOption,
  setFilterOption,
  numberOfActiveTodos,
  numberOfCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterOption === MainFilter.All,
          })}
          onClick={() => setFilterOption(MainFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterOption === MainFilter.Active,
          })}
          onClick={() => setFilterOption(MainFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterOption === MainFilter.Completed,
          })}
          onClick={() => setFilterOption(MainFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {numberOfCompletedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
