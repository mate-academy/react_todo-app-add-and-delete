import { FC } from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/HelperTypes';

type Props = {
  filterType: FilterType | null;
  handleFilterType: (value: FilterType) => void
  someCompleted: boolean
  countOfActive: number,
  removeCompletedTodos: () => void;
};

export const Footer: FC<Props> = ({
  filterType,
  handleFilterType,
  someCompleted,
  countOfActive,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countOfActive} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          onClick={() => handleFilterType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={() => handleFilterType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={() => handleFilterType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {someCompleted
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => removeCompletedTodos()}
          >
            Clear completed
          </button>
        )}
    </footer>
  );
};
