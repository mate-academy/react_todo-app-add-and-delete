import cn from 'classnames';

import type { FilterBy, FilterItem } from '../../types/Filter';

type Props = {
  currentFilter: FilterBy;
  filter: FilterItem;
  onFilterSelect: (filterBy: FilterBy) => void;
};

export const TodoFilterItem = ({
  currentFilter,
  filter,
  onFilterSelect,
}: Props) => {
  return (
    <a
      href={filter.href}
      className={cn('filter__link', {
        selected: filter.value === currentFilter,
      })}
      data-cy={`FilterLink${filter.title}`}
      onClick={() => onFilterSelect(filter.value)}
    >
      {filter.title}
    </a>
  );
};
