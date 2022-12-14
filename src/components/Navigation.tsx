import React from 'react';
import { Filter } from '../types/Filter';
import { TodoFilter } from './TodoFilter';

interface Props {
  isSelected: Filter,
  onFilterTodos: (filterBy: Filter) => void,
}

export const Navigation: React.FC<Props> = ({ isSelected, onFilterTodos }) => (
  <nav className="filter" data-cy="Filter">
    <TodoFilter
      dataAttr="FilterLinkAll"
      hrefAttr="#/"
      name={Filter.ALL}
      isSelected={isSelected}
      onFilterTodos={onFilterTodos}
    />

    <TodoFilter
      dataAttr="FilterLinkActive"
      hrefAttr="#/active"
      name={Filter.ACTIVE}
      isSelected={isSelected}
      onFilterTodos={onFilterTodos}
    />

    <TodoFilter
      dataAttr="FilterLinkCompleted"
      hrefAttr="#/completed"
      name={Filter.COMPLETED}
      isSelected={isSelected}
      onFilterTodos={onFilterTodos}
    />
  </nav>
);
