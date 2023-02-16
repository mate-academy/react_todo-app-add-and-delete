import React from 'react';
import classNames from 'classnames';

import { FilterType } from '../../enums/FilterType';

type Props = {
  activeTodosNum: number;
  completedTodosNum: number;
  selectedFilter: FilterType;
  onSelectFilter: (newFilter: FilterType) => void;
  onClearCompleted: () => void;
};

const filterOptions = Object.values(FilterType);

export const TodoFooter: React.FC<Props> = React.memo(
  ({
    activeTodosNum,
    completedTodosNum,
    selectedFilter,
    onSelectFilter,
    onClearCompleted,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">{`${activeTodosNum} items left`}</span>

        <nav className="filter">
          {filterOptions.map((option) => (
            <a
              key={option}
              href={`#/${option}`}
              className={classNames('filter__link', {
                selected: option === selectedFilter,
              })}
              onClick={() => onSelectFilter(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </a>
          ))}
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
    );
  },
);
