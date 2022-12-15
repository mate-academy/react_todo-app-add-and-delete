import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

interface Props {
  status: Status,
  onStatusChange: (value: Status) => void,
  href: string,
  selectedStatus: Status,
}

export const FilterItem: React.FC<Props> = React.memo((
  {
    status,
    onStatusChange,
    href,
    selectedStatus,
  },
) => {
  return (
    <a
      data-cy={`FilterLink${Status}`}
      href={href}
      className={classNames('filter__link', {
        selected: selectedStatus === status,
      })}
      onClick={() => onStatusChange(status)}
    >
      {status}
    </a>
  );
});
