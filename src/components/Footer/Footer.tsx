import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/Filter';

type Props = {
  filterOption: FilterType,
  onChangeFilterOption: (option: FilterType) => void
  activeTodosAmount: number,
  completedTodosAmount: number,
  handleClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  filterOption,
  onChangeFilterOption,
  activeTodosAmount,
  completedTodosAmount,
  handleClearCompleted,
}) => {
  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {activeTodosAmount === 1 ? '1 item left' : `${activeTodosAmount} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={
              classNames(
                'filter__link',
                { selected: filterOption === 'all' ? 'selected' : '' },
              )
            }
            onClick={() => onChangeFilterOption(FilterType.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={
              classNames(
                'filter__link',
                { selected: filterOption === 'active' ? 'selected' : '' },
              )
            }
            onClick={() => onChangeFilterOption(FilterType.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={
              classNames(
                'filter__link',
                { selected: filterOption === 'completed' ? 'selected' : '' },
              )
            }
            onClick={() => onChangeFilterOption(FilterType.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleClearCompleted()}
        >
          {completedTodosAmount > 0 ? 'Clear completed' : ''}
        </button>
      </footer>
    </>
  );
};
