import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useRef, useState, useCallback } from 'react';

interface TodoProps {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onComplete?: (id: number, completed: boolean) => void;
  onEdit?: (id: number, title: string) => void;
}

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isLoading = false,
  onDelete = () => {},
  onComplete = () => {},
  onEdit = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [field, setField] = useState<string>(todo.title);

  const inputField = useRef<HTMLInputElement>(null);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    inputField.current?.focus();
  }, []);

  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label" aria-label="Toggle todo status">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onComplete(todo.id, !todo.completed)}
          />
        </label>

        {!isEditing ? (
          <span data-cy="TodoTitle" className="todo__title" onClick={startEdit}>
            {field}
          </span>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              onEdit(todo.id, field);
              setIsEditing(false);
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={field}
              onBlur={() => setIsEditing(false)}
              onChange={e => setField(e.target.value)}
              ref={inputField}
            />
          </form>
        )}

        {/* For Edited todo, we have a form to edit the todo */}

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
