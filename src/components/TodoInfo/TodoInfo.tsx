import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void,
  onChangeCompleted: (todoId: number) => void,
  deletedTodoId: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onChangeCompleted,
  deletedTodoId,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChangeCompleted(id)}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={`modal overlay ${(!id || deletedTodoId.includes(id)) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
