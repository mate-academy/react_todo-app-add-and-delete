import classNames from 'classnames';
import React from 'react';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  onChangeFilter: (status: TodoStatus) => void;
  status: TodoStatus;
};

export const FilterForTodo: React.FC<Props> = ({
  onChangeFilter, status,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: status === TodoStatus.ALL },
        )}
        onClick={() => onChangeFilter(TodoStatus.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: status === TodoStatus.ACTIVE },
        )}
        onClick={() => onChangeFilter(TodoStatus.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: status === TodoStatus.COMPLETED },
        )}
        onClick={() => onChangeFilter(TodoStatus.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
