import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (val: number) => void;
  onStatusChange: (val: Todo) => Promise<void>;
  isLoading: number[];
  onEdit: (val: Todo) => Promise<void>;
  isUpdateError: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onStatusChange,
  onEdit,
  isUpdateError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(todo.title);
  const field = useRef<HTMLInputElement>(null);
  const { id, title, completed } = todo;

  useEffect(() => {
    field.current?.focus();
  }, [isEditing, isUpdateError]);

  const handleEditClose = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEdit.trim()) {
      onDelete(id);
      setIsEditing(false);

      return;
    }

    if (title === titleEdit) {
      setIsEditing(false);

      return;
    }

    onEdit({ ...todo, title: titleEdit.trim() });

    if (!isUpdateError) {
      setIsEditing(false);
    }
  };

  const handleKeyChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onStatusChange(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditClose}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={field}
            value={titleEdit}
            onChange={e => setTitleEdit(e.target.value)}
            onBlur={handleEditClose}
            onKeyUp={handleKeyChange}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading.includes(todo.id),
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
