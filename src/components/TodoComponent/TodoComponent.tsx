import React, { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemove: (todoData: Todo) => void;
}

export const TodoComponent: FC<Props> = React.memo(({
  todo,
  onRemove,
}) => {
  const { title, completed } = todo;

  const handleDeleteTodo = () => {
    onRemove(todo);
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
