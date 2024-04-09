import React from 'react';
import { FilterOption } from '../../enums/FilterOption';
import classNames from 'classnames';

type Props = {
  filterBy: FilterOption;
  setFilterBy: (filterBy: FilterOption) => void;
};

export const TodoFilter: React.FC<Props> = ({ filterBy, setFilterBy }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterOption).map(link => (
        <a
          key={link}
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === link,
          })}
          data-cy={`FilterLink${link}`}
          onClick={() => setFilterBy(link)}
        >
          {link}
        </a>
      ))}
    </nav>
  );
};
