import React from 'react';
import classNames from 'classnames';
import { TodoFilter } from '../TodoFilter';
import { Filter } from '../../types/Filter';

interface Props {
  filterBy: Filter;
  setFilterBy: (filter: Filter) => void;
  activeCount: number;
  isCompleted: boolean;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeCount,
  isCompleted,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeCount} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !isCompleted,
        })}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
