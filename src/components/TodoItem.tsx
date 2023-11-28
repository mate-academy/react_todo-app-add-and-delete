import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo?: (todoId: Todo['id']) => Promise<void>;
  isProcessed?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDeleteTodo = () => { },
  isProcessed = false,
}) => {
  const [isEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id, title, completed } = todo;

  const handleDeleteTodo = () => {
    setIsDeleting(true);
    onDeleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      {!isEditing
        ? (
          <div>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              aria-label="deleteTodo"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </div>
        )
        : (
          <form
            onChange={() => { }}
          >
            {/* This form is shown instead of the title and remove button */}
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
            />
          </form>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
