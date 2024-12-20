import React, { Dispatch, SetStateAction } from 'react';
import { FilterStatus } from '../types/FilterStatus';
import classNames from 'classnames';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  todosLeft: number;
  todosCompleted: number;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    filterStatus,
    setFilterStatus,
    todosLeft,
    todosCompleted,
    onClearCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(filter => (
          <a
            key={filter}
            href={`#/${filter === FilterStatus.All ? '' : filter.toLocaleLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={todosCompleted === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
