import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterStatus: Filter;
  setFilterStatus: Dispatch<SetStateAction<Filter>>;
  todosLeft: number;
  completedTodosLeft: number;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    filterStatus,
    setFilterStatus,
    todosLeft,
    onClearCompleted,
    completedTodosLeft,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href={`#/${value === Filter.All ? '' : value.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterStatus === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilterStatus(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!completedTodosLeft}
      >
        Clear completed
      </button>
    </footer>
  );
};
