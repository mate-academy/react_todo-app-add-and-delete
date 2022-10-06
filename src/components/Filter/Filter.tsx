import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { Status } from '../../types/Status';

type Props = {
  statuses: Status[];
  selectedStatusId: string;
  onStatusSelected: (value:Status) => void;
};

export const Filter: React.FC<Props> = ({
  statuses,
  selectedStatusId,
  onStatusSelected,
}) => {
  const selectedStatus = useMemo(() => {
    return statuses.find(
      status => selectedStatusId === status.id,
    ) || statuses[0];
  }, [selectedStatusId]);

  const handleClick = useCallback((status: Status) => {
    return status.id !== selectedStatusId && onStatusSelected(status);
  }, [selectedStatusId, onStatusSelected]);

  return (
    <nav className="filter" data-cy="Filter">
      {statuses.map((status) => (
        <a
          key={status.id}
          data-cy={`FilterLink${status.title}`}
          href={`#${status.link}`}
          className={classNames(
            'filter__link',
            {
              selected: status.id === selectedStatus.id,
            },
          )}
          onClick={() => handleClick(status)}
        >
          {status.title}
        </a>
      ))}
    </nav>
  );
};
