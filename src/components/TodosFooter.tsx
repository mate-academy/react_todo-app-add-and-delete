import classNames from 'classnames';
import { FC } from 'react';

export enum FILTERS {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filterBy: FILTERS,
  activeTodosLength: number,
  completedTodosLength: number,
  onFilterChange: (filterBy: FILTERS) => void
  onDeleteCompleted: () => void
};

export const TodosFooter: FC<Props> = ({
  filterBy,
  activeTodosLength,
  completedTodosLength,
  onFilterChange,
  onDeleteCompleted,
}) => {
  const handleOnDelete = () => {
    if (completedTodosLength) {
      onDeleteCompleted();
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FILTERS).map((value) => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filterBy === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onFilterChange(value as FILTERS)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodosLength <= 0}
        onClick={handleOnDelete}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
