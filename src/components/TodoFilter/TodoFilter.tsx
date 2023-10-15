import React, { useState } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  changeQuery: (query: Filter) => void,
};

const FILTER_MODE = [Filter.all, Filter.active, Filter.completed];

export const TodoFilter: React.FC<Props> = ({ changeQuery }) => {
  const [filterMode, setFilterMode] = useState(Filter.all);

  const handleSetFilter = (filter: Filter) => {
    changeQuery(Filter[filter]);
    setFilterMode(filter);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <ul className="filter">
      {FILTER_MODE.map(currentFilter => {
        const textFilter = capitalizeFirstLetter(currentFilter);

        return (
          <li key={currentFilter}>
            <a
              href={`#${currentFilter === Filter.all ? '/' : `/${currentFilter}`}`}
              onClick={() => handleSetFilter(Filter[currentFilter])}
              className={classNames('filter__link', {
                selected: (filterMode === Filter[currentFilter]),
              })}
            >
              {textFilter}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
