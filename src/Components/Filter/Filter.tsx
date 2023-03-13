import classNames from 'classnames';
import React from 'react';

import { Filters } from '../../types/Filters';

type Props = {
  filter: Filters;
  changeFilter: (value: Filters) => void;
};

const links = [
  { href: '/', type: Filters.All },
  { href: '/active', type: Filters.ACTIVE },
  { href: '/completed', type: Filters.COMPLETED },
];

const Filter: React.FC<Props> = ({ filter, changeFilter }) => (
  <nav>
    <ul className="filter">
      {links.map(({ href, type }) => (
        <li key={href}>
          <a
            href={`#${href}`}
            className={classNames(
              'filter__link',
              { selected: filter === type },
            )}
            onClick={() => changeFilter(type)}
          >
            {type}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export default Filter;
