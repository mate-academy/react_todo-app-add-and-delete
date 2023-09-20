import React from 'react';
import classNames from 'classnames';
import { Status } from '../../enums/Status';

type Props = {
  filter: Status,
  updateFilter: (newFilter: Status) => void,
};

export const TodoFilter: React.FC<Props> = ({ filter, updateFilter }) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    activeFilter: Status,
  ) => {
    event.preventDefault();
    updateFilter(activeFilter);
  };

  return (
    <nav className="filter">
      {Object.values(Status).map((status) => (
        <a
          key={status}
          href={`#/${status.toLowerCase()}`}
          className={classNames(
            'filter__link',
            { selected: filter === status },
          )}
          onClick={event => handleFilterClick(event, status)}
        >
          {status}
        </a>
      ))}
    </nav>
  );
};
