import React, { useState } from 'react';
import cn from 'classnames';

import { filterLinks } from './filterLinks';
import { FilterLink, FilterStatus } from '../../types/FilterLink';

type Props = {
  onSetFilterStatus: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = React.memo(
  ({ onSetFilterStatus }) => {
    const [
      selectedFilterLinkId,
      setSelectedFilterLinkId,
    ] = useState(filterLinks[0].id);

    const setFilterParameters = ({ id, title }: FilterLink) => {
      setSelectedFilterLinkId(id);
      onSetFilterStatus(title);
    };

    return (
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            data-cy={`FilterLink${link.title}`}
            href={`#/${link.url}`}
            className={cn(
              'filter__link',
              { selected: link.id === selectedFilterLinkId },
            )}
            onClick={() => setFilterParameters(link)}
            key={link.id}
          >
            {link.title}
          </a>
        ))}
      </nav>
    );
  },
);
