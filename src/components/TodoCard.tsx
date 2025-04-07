import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDefaultLoading?: boolean | undefined;
  onDelete: (id: number) => Promise<void>;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  isDefaultLoading = false,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(isDefaultLoading);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <span style={{ display: 'none' }}>Mark as completed</span>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title={`status ${todo.id}`}
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsLoading(true);
              onDelete(todo.id).then(() => {
                setIsLoading(false);
              });
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
