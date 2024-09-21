import React from 'react';
import { SelectOption } from '../../App';
import cn from 'classnames';

type Props = {
  option: string;
  onSetOption: (v: string) => void;
};

export const Filter: React.FC<Props> = ({ option, onSetOption }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(SelectOption).map((filterType, index) => (
        <a
          href="#/"
          key={index}
          className={cn('filter__link', {
            selected: option === filterType,
          })}
          data-cy={`FilterLink${filterType.slice(0, 1).toUpperCase() + filterType.slice(1)}`}
          onClick={() => onSetOption(filterType)}
        >
          {filterType.slice(0, 1).toUpperCase() + filterType.slice(1)}
        </a>
      ))}
    </nav>
  );
};
