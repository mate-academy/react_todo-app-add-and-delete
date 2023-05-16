import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodoId?: number;
  onDelete?: (todoDelte: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  tempTodoId = 0,
  todo,
  onDelete = () => {},
}) => {
  const { completed, title } = todo;
  const isSuccess = completed === true;
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);

  return (
    <div className={classNames('todo', {
      completed: isSuccess,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={async () => {
          setIsLoading(true);

          await onDelete(todo);

          setIsLoading(false);
        }}
        disabled={isLoading}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
