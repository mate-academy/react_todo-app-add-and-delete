import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  status: string,
  onStatusChange: (newStatus: string) => void,
  possibleStatus: string[],
  willClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  possibleStatus,
  willClearCompleted,
}) => {
  const isCompleted = todos.find(todo => todo.completed);
  const items = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${items} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {possibleStatus.map((current) => (
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={classNames(
              'filter__link',
              { selected: current === status },
            )}
            key={current}
            onClick={() => onStatusChange(current)}
          >
            {current}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isCompleted}
        onClick={willClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
