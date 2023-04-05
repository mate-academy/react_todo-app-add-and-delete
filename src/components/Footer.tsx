import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../enums/FilterType';

type Props = {
  activeTodosNum: number;
  completedTodosNum: number;
  selectedFiter: FilterType;
  onSelectedFilter: (newFiter: FilterType) => void;
  onClearCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  activeTodosNum,
  completedTodosNum,
  selectedFiter,
  onSelectedFilter,
  onClearCompleted,
}) => {
  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">{`${activeTodosNum} items left`}</span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: selectedFiter === FilterType.all,
            })}
            onClick={() => onSelectedFilter(FilterType.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: selectedFiter === FilterType.active,
            })}
            onClick={() => onSelectedFilter(FilterType.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: selectedFiter === FilterType.completed,
            })}
            onClick={() => onSelectedFilter(FilterType.completed)}
          >
            Completed
          </a>
        </nav>
        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            hidden: completedTodosNum === 0,
          })}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};

export default Footer;
