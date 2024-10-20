import { FC, Dispatch, SetStateAction } from 'react';
import { Filter } from '../../types/Filter';
import cn from 'classnames';

type Props = {
  completedTodoIds: number[];
  uncompletedTodosAmount: number;
  filterOption: Filter;
  setFilterOption: Dispatch<SetStateAction<Filter>>;
  setDeletionIds: Dispatch<SetStateAction<number[]>>;
};

export const Footer: FC<Props> = ({
  completedTodoIds,
  uncompletedTodosAmount,
  filterOption,
  setFilterOption,
  setDeletionIds,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => {
          return (
            <a
              href={filter === 'All' ? '#/' : `#/${filter.toLowerCase()}`}
              className={cn('filter__link', {
                selected: filter === filterOption,
              })}
              data-cy={`FilterLink${filter}`}
              key={filter}
              onClick={() => setFilterOption(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => setDeletionIds(completedTodoIds)}
        disabled={!completedTodoIds.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
