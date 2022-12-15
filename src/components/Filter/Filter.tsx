import React from 'react';
import { FilterItem } from '../FilterItem/FilterItem';
import { Status } from '../../types/Status';

interface Props {
  todosQuantity: number,
  status: Status,
  onStatusChange: (value: Status) => void,
}

export const Filter: React.FC<Props> = React.memo(
  (
    {
      todosQuantity,
      status,
      onStatusChange,
    },
  ) => {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${todosQuantity} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <FilterItem
            status={Status.All}
            href="#/"
            onStatusChange={onStatusChange}
            selectedStatus={status}
          />

          <FilterItem
            status={Status.Active}
            href="#/active"
            onStatusChange={onStatusChange}
            selectedStatus={status}
          />

          <FilterItem
            status={Status.Completed}
            href="#/completed"
            onStatusChange={onStatusChange}
            selectedStatus={status}
          />
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
