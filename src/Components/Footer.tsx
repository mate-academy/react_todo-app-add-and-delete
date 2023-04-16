import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todosToShow: Todo[],
  selectedStatus: Status,
  setSelectedStatus: (value:Status) => void,
  removeTodoCompleted:() => void;
};

export const Footer: React.FC<Props> = ({
  todosToShow,
  selectedStatus,
  setSelectedStatus,
  removeTodoCompleted,
}) => {
  const todoLeft = todosToShow.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.All },
          )}
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Active },
          )}
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Completed },
          )}
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
