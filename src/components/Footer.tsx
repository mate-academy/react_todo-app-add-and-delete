import classNames from 'classnames';
import { Status } from '../types/Status';
import React from 'react';

type Props = {
  itemsLeft: number;
  status: Status;
  isCompletedTodo: boolean;
  onChangeStatus: (status: Status) => void;
  onClearCopletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  status,
  isCompletedTodo,
  onChangeStatus,
  onClearCopletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(element => (
          <a
            href={element === 'All' ? '#/' : `#/${element.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === element,
            })}
            data-cy={
              element === Status.All
                ? 'FilterLinkAll'
                : element === Status.Active
                  ? 'FilterLinkActive'
                  : 'FilterLinkCompleted'
            }
            onClick={() => onChangeStatus(element)}
            key={element}
          >
            {element}
          </a>
        ))}
      </nav>

      <button
        disabled={!isCompletedTodo}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCopletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
