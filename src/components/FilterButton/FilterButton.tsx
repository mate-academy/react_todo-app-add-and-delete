import classNames from 'classnames';
import React from 'react';
import { TodoStatusFilter } from '../../types/Todo';

interface Props {
  status: TodoStatusFilter;
  selectedStatus: string;
  onSelectStatus: (status: TodoStatusFilter) => void;
}

export const FilterButton: React.FC<Props> = ({
  status,
  selectedStatus,
  onSelectStatus,
}) => {
  const isSelected = selectedStatus === status;
  const normalizedHref = status.toLowerCase();

  return (
    <a
      href={`#/${normalizedHref}`}
      className={classNames('filter__link', {
        selected: isSelected,
      })}
      data-cy={`FilterLink${status}`}
      onClick={() => onSelectStatus(status)}
    >
      {status}
    </a>
  );
};
