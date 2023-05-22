import { FC } from 'react';
import cn from 'classnames';
import { Status } from '../../enum/Status';

type Props = {
  status: Status;
  onStatusChanged: (status: Status) => void;
};

export const TodoStatus: FC<Props> = ({ status, onStatusChanged }) => {
  const statusOptions = [
    { value: Status.All },
    { value: Status.Active },
    { value: Status.Completed },
  ];

  return (
    <nav className="filter">
      {statusOptions.map(({ value }) => (
        <a
          key={value}
          href={`#/${value}`}
          className={cn('filter__link', {
            selected: status === value,
          })}
          onClick={() => onStatusChanged(value)}
        >
          {value}
        </a>
      ))}
    </nav>
  );
};
