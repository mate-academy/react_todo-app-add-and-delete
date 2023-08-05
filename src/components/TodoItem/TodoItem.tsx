import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  hasLoader: boolean;
  onDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  hasLoader,
  onDeleteTodo,
}) => {
  const { id, title, completed } = todo;

  const handlerDeleteTodo = () => {
    onDeleteTodo(id);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handlerDeleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      { hasLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
