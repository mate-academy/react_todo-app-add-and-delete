import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  filterBy: Filter;
  onSelect: (filter: Filter) => void;
}

export const TodoFilter: React.FC<Props> = ({ filterBy, onSelect }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: filterBy === Filter.All })}
        onClick={(event) => {
          event.preventDefault();
          onSelect(Filter.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: filterBy === Filter.Active })}
        onClick={(event) => {
          event.preventDefault();
          onSelect(Filter.Active);
        }}
      >
        {Filter.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: filterBy === Filter.Completed })}
        onClick={(event) => {
          event.preventDefault();
          onSelect(Filter.Completed);
        }}
      >
        {Filter.Completed}
      </a>
    </nav>
  );
};
