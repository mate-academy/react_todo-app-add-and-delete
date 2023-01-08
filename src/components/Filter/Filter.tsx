import React, { useState } from 'react';
import cn from 'classnames';

import { filterLinks } from './filterLinks';
import { FilterLink, FilterStatus } from '../../types/FilterLink';

type Props = {
  onSetFilterStatus: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ onSetFilterStatus }) => {
  const [
    selectedFilterLink,
    setSelectedFilterLink,
  ] = useState(filterLinks[0]);

  const setFilterParameters = (filterLink: FilterLink) => {
    setSelectedFilterLink(filterLink);
    onSetFilterStatus(filterLink.title);
  };

  return (
    <nav className="filter" data-cy="Filter">
      {filterLinks.map(link => (
        <a
          data-cy={`FilterLink${link.title}`}
          href={`#/${link.url}`}
          className={cn(
            'filter__link',
            { selected: link.id === selectedFilterLink.id },
          )}
          onClick={() => setFilterParameters(link)}
          key={link.id}
        >
          {link.title}
        </a>
      ))}
    </nav>
  );
};
