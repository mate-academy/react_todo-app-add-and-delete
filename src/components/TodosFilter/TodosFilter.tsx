import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/Todo';

type Props = {
  handleChangeTodos: (value: TodoStatus) => void,
  todoFilter: TodoStatus,
};

export const TodosFilter: React.FC<Props> = ({
  handleChangeTodos,
  todoFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: todoFilter === `${TodoStatus.All}` },
        )}
        onClick={() => handleChangeTodos(TodoStatus.All)}
      >
        {TodoStatus.All}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: todoFilter === `${TodoStatus.Active}` },
        )}
        onClick={() => handleChangeTodos(TodoStatus.Active)}
      >
        {TodoStatus.Active}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: todoFilter === `${TodoStatus.Completed}` },
        )}
        onClick={() => handleChangeTodos(TodoStatus.Completed)}
      >
        {TodoStatus.Completed}
      </a>
    </nav>
  );
};
