/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => void;
  onSave: (id: number) => void;
  editValue: string;
  setEditValue: (value: string) => void;
  unique: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  editValue,
  setEditValue,
  onSave,
  unique,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const handleEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSave(todo.id);
      setIsEditing(false);
    } else if (event.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditValue(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsDeleting(true);
              onDelete(todo.id).finally(() => setIsDeleting(false));
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={event => setEditValue(event.target.value)}
            onBlur={() => {
              onSave(todo.id);
              setIsEditing(false);
            }}
            onKeyUp={handleEdit}
            ref={editRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': unique || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
