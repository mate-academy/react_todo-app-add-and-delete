import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  selectStatus: (status:TodoStatus)=> void;
  selectedStatus: TodoStatus;
};
type Statuses = ['All', 'Active', 'Completed'];

export const StatusFilter: React.FC<Props> = ({
  selectStatus,
  selectedStatus,
}) => {
  const handleButton = (status:TodoStatus) => selectStatus(status);

  const statuses: Statuses = ['All', 'Active', 'Completed'];

  return (
    <nav className="filter">
      {statuses.map((status) => (
        <a
          href="#/"
          key={status}
          className={classNames(
            'filter__link', {
              selected: selectedStatus === TodoStatus[status],
            },
          )}
          onClick={() => handleButton(TodoStatus[status])}
        >
          {status}
        </a>
      ))}
    </nav>

  );
};
