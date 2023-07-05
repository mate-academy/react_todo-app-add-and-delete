import React, { memo } from 'react';
import cN from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void
  isLoading?: boolean
};

export const TodoItem: React.FC<Props> = memo(
  ({
    todo,
    onDelete,
    isLoading = true,
  }) => {
    const {
      id,
      title,
      completed,
    } = todo;

    const handleDeleteTodo = () => onDelete(id);

    return (
      <div
        className={cN('todo', {
          completed,
        })}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            readOnly
          />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={handleDeleteTodo}
        >
          ×
        </button>

        <div
          className={cN('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
