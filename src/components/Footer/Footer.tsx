import React from 'react';
import classNames from 'classnames';

import { TodoFilter } from '../TodoFilter/TodoFilter';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

interface Props {
  activeTodos: Todo[];
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  completedTodos: Todo[];
  onDelete: () => Promise<void>;
}

export const Footer: React.FC<Props> = (props) => {
  const {
    activeTodos,
    status,
    setStatus,
    completedTodos,
    onDelete,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter
        status={status}
        setStatus={setStatus}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !completedTodos.length,
          },
        )}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
