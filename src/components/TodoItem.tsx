import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isEditing?: boolean;
  isLoading?: boolean;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isEditing = false,
  isLoading = false,
  onDelete,
}) => {
  const todoClass = classNames('todo', {
    completed: todo.completed,
    editing: isEditing,
    'is-loading': isLoading,
  });

  return (
    <div data-cy="Todo" className={todoClass}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      {/* Title or editing input */}
      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
            readOnly
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {/* Remove button (pokazuje się tylko jeśli nie w edycji/loading) */}
      {!isEditing && !isLoading && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
