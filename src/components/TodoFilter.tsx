import classNames from 'classnames';
import React from 'react';
import { Filter, FilterType } from '../types/FilterType';
import { filterTranslations, t } from '../utils/phrases';

interface Props {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => {
  const filterOptions = Object.entries(Filter).map(([label, value]) => ({
    label,
    translatedLabel: t(filterTranslations[value]),
    value,
    href: value === Filter.All ? '#/' : `#/${value}`,
  }));

  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(option => (
        <a
          key={option.value}
          href={option.href}
          className={classNames('filter__link', {
            selected: filter === option.value,
          })}
          data-cy={`FilterLink${option.label}`}
          onClick={e => {
            e.preventDefault();
            onFilterChange(option.value);
          }}
        >
          {option.translatedLabel}
        </a>
      ))}
    </nav>
  );
};
