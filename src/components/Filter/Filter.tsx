import React from 'react';
import classNames from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  filter: Filters.All | Filters.Active | Filters.Completed;
  onChange: (filter: Filters.All | Filters.Active | Filters.Completed) => void;
};

export const Filter: React.FC<Props> = ({ filter, onChange }) => (
  <nav className="filter" data-cy="Filter">
    {([Filters.All, Filters.Active, Filters.Completed] as const).map(type => (
      <a
        key={type}
        href={`#/${type === 'all' ? '' : type}`}
        className={classNames('filter__link', { selected: filter === type })}
        data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1)}`}
        onClick={e => {
          e.preventDefault();
          onChange(type);
        }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </a>
    ))}
  </nav>
);
