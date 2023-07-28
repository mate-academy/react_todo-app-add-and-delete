import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectStatus } from '../types/SelectStatus';

type Props = {
  filteredTodos: Todo[],
  todosFromServer: Todo[],
  selectedStatus: string,
  setSelectedStatus: (value: SelectStatus) => void;
  deleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  filteredTodos: todos,
  todosFromServer,
  selectedStatus,
  setSelectedStatus,
  deleteCompletedTodos,
}) => {
  const areCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosFromServer.length} items left`}
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

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': !areCompletedTodos },
        )}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
