import React from 'react';
import { TodoStatusFilter } from '../../types/ErrorMessage';
import cn from 'classnames';

type Props = {
  status: TodoStatusFilter;
  selectedStatus: string;
  onSelectStatus: (status: TodoStatusFilter) => void;
};

export const FilterButton: React.FC<Props> = ({
  status,
  selectedStatus,
  onSelectStatus,
}) => {
  const isSelected = selectedStatus === status;

  return (
    <a
      href={`#/${status}`}
      className={cn('filter__link', { selected: isSelected })}
      data-cy={`FilterLink${status}`}
      onClick={() => onSelectStatus(status)}
    >
      {status}
    </a>
  );
};
