import classNames from 'classnames';
import React, { useContext } from 'react';
import { Status } from '../types/Status';
import { TodoContext } from '../contexts/TodoContext';

type Props = {
  completed: number;
};

export const TodoFooter: React.FC<Props> = ({ completed }) => {
  const { status, changeStatus } = useContext(TodoContext);

  const handleChangeStatus = (statusValue: Status) => {
    changeStatus(statusValue);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completed} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(statusValue => (
          <a
            key={statusValue}
            href={`#${statusValue.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === statusValue,
            })}
            data-cy={`FilterLink${statusValue}`}
            onClick={() => handleChangeStatus(statusValue)}
          >
            {statusValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
