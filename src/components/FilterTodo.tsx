import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';
import { DataCy } from '../types/DataCy';

interface Props {
  selectedFilter: Filter,
  setFilter: (filter: Filter) => void,
  filterType: Filter,
  dataCy: DataCy,
}

export const FilterTodo: React.FC<Props> = ({
  selectedFilter,
  setFilter,
  filterType,
  dataCy,
}) => (
  <a
    data-cy={dataCy}
    href={`#/${filterType}`}
    className={classNames(
      'filter__link',
      { selected: selectedFilter === filterType },
    )}
    onClick={() => setFilter(filterType as Filter)}
  >
    {filterType}
  </a>
);
