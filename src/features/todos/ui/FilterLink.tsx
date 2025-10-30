import React from 'react';
import cn from 'classnames';
import { Filter } from '../model/types';

export const FilterLink: React.FC<{
  filter: Filter;
  currentFilter: Filter;
  setFilter: (filter: Filter) => void;
  label: string;
  dataCy: string;
}> = ({ filter, currentFilter, setFilter, label, dataCy }) => (
  <a
    href={`#/${filter}`}
    className={cn('filter__link', { selected: currentFilter === filter })}
    data-cy={dataCy}
    onClick={() => setFilter(filter)}
  >
    {label}
  </a>
);
