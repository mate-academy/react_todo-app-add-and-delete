import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  todosCounter: number;
  todosCompletedCounter: number;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    filter,
    setFilter,
    todosCounter,
    onClearCompleted,
    todosCompletedCounter,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterStatus => (
          <a
            key={filterStatus}
            href={`#/${filterStatus === Filter.All ? '' : filterStatus.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === filterStatus,
            })}
            data-cy={`FilterLink${filterStatus}`}
            onClick={() => {
              setFilter(filterStatus);
            }}
          >
            {filterStatus}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={todosCompletedCounter === 0}
        data-cy="ClearCompletedButton"
        onClick={() => {
          onClearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
