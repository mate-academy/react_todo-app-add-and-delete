import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import React from 'react';

type Props = {
  filterBy: FilterStatus;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterStatus>>;
  notCompletedTasksCounter: number;
  isCompletedExists: boolean;
  clearCompletedTasks: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  notCompletedTasksCounter,
  isCompletedExists,
  clearCompletedTasks,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTasksCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(todoType => (
          <a
            href={`#/${todoType}`}
            key={todoType}
            className={classNames('filter__link', {
              selected: todoType === filterBy,
            })}
            data-cy={`FilterLink${todoType}`}
            onClick={() => setFilterBy(todoType)}
          >
            {todoType}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedExists}
        onClick={clearCompletedTasks}
      >
        Clear completed
      </button>
    </footer>
  );
};