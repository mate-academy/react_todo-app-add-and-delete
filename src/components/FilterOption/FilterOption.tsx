import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterBy: FilterType;
  activeFilter: string;
  setActiveFilter: (filter: FilterType) => void;
};

export const FilterOption: React.FC<Props> = ({
  filterBy,
  activeFilter,
  setActiveFilter,
}) => {
  const handlerFilter = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filter: FilterType,
  ) => {
    event.preventDefault();
    setActiveFilter(filter);
  };

  return (
    <a
      href={filterBy === FilterType.all ? '#/' : `#/${filterBy.toLowerCase()}`}
      className={classNames('filter__link ', {
        selected: activeFilter === filterBy,
      })}
      data-cy={`FilterLink${filterBy}`}
      onClick={e => handlerFilter(e, filterBy)}
    >
      {filterBy}
    </a>
  );
};
