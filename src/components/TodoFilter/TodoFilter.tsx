import { FC } from 'react';
import cn from 'classnames';
import './TodoFilter.scss';
import { StatusFilter } from '../../types';

interface Props {
  statusFilter: StatusFilter;
  onChangeStatusFilter: (status: StatusFilter) => void;
}

export const TodoFilter: FC<Props> = ({
  statusFilter,
  onChangeStatusFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(StatusFilter).map(status => {
        const isSelectedCurrentStatus = statusFilter === status;
        const link = `#/${status === StatusFilter.All ? '' : status.toLocaleLowerCase()}`;

        return (
          <a
            key={status}
            data-cy={`FilterLink${status}`}
            href={link}
            className={cn('filter__link', {
              selected: isSelectedCurrentStatus,
            })}
            onClick={() => onChangeStatusFilter(status)}
          >
            {status}
          </a>
        );
      })}
    </nav>
  );
};
