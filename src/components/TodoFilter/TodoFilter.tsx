import cn from 'classnames';
import { FilterType } from '../../types/FilterType';
import React, { useContext } from "react";
import { TodosContext } from "../../components/TodosProvider";

export const TodoFilter: React.FC = () => {
  const {filter, onFilterChange} = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === FilterType.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FilterType.all)}
      >
        {FilterType.all}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === FilterType.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(FilterType.active)}
      >
        {FilterType.active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FilterType.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(FilterType.completed)}
      >
        {FilterType.completed}
      </a>
    </nav>
  );
};

