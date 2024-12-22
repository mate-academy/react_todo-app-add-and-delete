import classNames from 'classnames';
import { FILTER_BY } from '../constants/constants';
import React from 'react';

interface Props {
  filter: string;
  onFilter: (v: string) => void;
}

export const Filter: React.FC<Props> = ({
  filter: currentFilter,
  onFilter,
}) => {
  const getNameFilter = (str: string) =>
    str.slice(0, 1).toUpperCase() + str.slice(1);

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FILTER_BY).map(filter => (
        <a
          key={filter}
          href={`#/${filter}`}
          className={classNames('filter__link', {
            selected: currentFilter === filter,
          })}
          data-cy={`FilterLink${getNameFilter(filter)}`}
          onClick={() => onFilter(filter)}
        >
          {getNameFilter(filter)}
        </a>
      ))}
    </nav>
  );
};
