import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeletingTodo?: (id: number) => void,
  tempTodo?: Todo | null
  todosForDeleting: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeletingTodo,
  tempTodo,
  todosForDeleting,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeletingTodo && handleDeletingTodo(id)}
      >
        ×
      </button>
      <div className={classNames('modal overlay',
        {
          'is-active': tempTodo?.id === id || todosForDeleting.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
