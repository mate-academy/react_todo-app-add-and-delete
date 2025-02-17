import { FC, memo } from 'react';
import { Filter } from '../../types';
import classNames from 'classnames';
import React from 'react';
import { navLinks } from './navLinks';

type Props = {
  activeFilter: Filter;
  onFilter: (activeFilter: Filter) => void;
};

export const Navigation: FC<Props> = memo(({ activeFilter, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {navLinks.map(({ title, href, filter, dataCy }) => (
        <a
          href={`#/${href}`}
          data-cy={dataCy}
          key={title}
          className={classNames('filter__link ', {
            selected: activeFilter === filter,
          })}
          onClick={() => onFilter(filter)}
        >
          {title}
        </a>
      ))}
    </nav>
  );
});

Navigation.displayName = 'NavigationMemo';
