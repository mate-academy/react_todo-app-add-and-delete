import React from 'react';
import cn from 'classnames';
import { FiltersType } from '../../types/FiltersType';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  activeCount: number | undefined;
  completedCount: number | undefined;
  status: FiltersType;
  setStatus: Dispatch<SetStateAction<FiltersType>>;
  onDeleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = props => {
  const {
    activeCount,
    completedCount,
    status,
    setStatus,
    onDeleteAllCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FiltersType).map(filter => (
          <a
            key={filter}
            href={`#/${filter === FiltersType.All ? '' : filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: status === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => {
              setStatus(filter);
            }}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAllCompleted}
        disabled={!completedCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
