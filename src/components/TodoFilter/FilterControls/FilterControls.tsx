import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../../types/TodoStatus';

type Props = {
  todoStatus: TodoStatus;
  onSelect: (status: TodoStatus) => void;
};

export const FilterControls: React.FC<Props> = ({ todoStatus, onSelect }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.All },
        )}
        onClick={() => onSelect(TodoStatus.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.Active },
        )}
        onClick={() => onSelect(TodoStatus.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.Completed },
        )}
        onClick={() => onSelect(TodoStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
