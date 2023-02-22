import React, { useState } from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

interface Props {
  changeFilter: (FilterBy: FilterBy) => void;
  itemsCounter: number;
  hasComplitedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  changeFilter,
  itemsCounter,
  hasComplitedTodos,
}) => {
  const [activeBtn, setActiveBtn] = useState(FilterBy.All);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    selectedFilter: FilterBy,
  ) => {
    event.preventDefault();
    setActiveBtn(selectedFilter);
    changeFilter(selectedFilter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsCounter} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeBtn === FilterBy.All,
          })}
          onClick={(event) => handleClick(event, FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeBtn === FilterBy.Active,
          })}
          onClick={(event) => handleClick(event, FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeBtn === FilterBy.Complited,
          })}
          onClick={(event) => handleClick(event, FilterBy.Complited)}
        >
          Completed
        </a>
      </nav>

      <button type="button" className="todoapp__clear-completed">
        {hasComplitedTodos && 'Clear completed'}
      </button>
    </footer>
  );
};
