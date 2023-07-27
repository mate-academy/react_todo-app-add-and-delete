import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectStatus } from '../types/SelectStatus';

type Props = {
  todos: Todo[],
  selectedStatus: string,
  setSelectedStatus: (value: SelectStatus) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.All },
          )}
          onClick={() => setSelectedStatus(SelectStatus.All)}
        >
          {SelectStatus.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.Active },
          )}
          onClick={() => setSelectedStatus(SelectStatus.Active)}
        >
          {SelectStatus.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.Completed },
          )}
          onClick={() => setSelectedStatus(SelectStatus.Completed)}
        >
          {SelectStatus.Completed}
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {
        todos.some(todo => todo.completed)
        && (
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
