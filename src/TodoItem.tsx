import { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);
  const isEscapped = useRef(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (isEscapped.current) {
      isEscapped.current = false;

      return;
    }

    if (!isEditing || isSubmitting.current) {
      return;
    }

    // setIsEditing(false);

    if (editedTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim()) {
      onDelete(todo.id);

      return;
    }

    isSubmitting.current = true;

    onUpdate({
      ...todo,
      title: editedTitle.trim(),
    })
      .then(() => {
        setIsEditing(false);
      })

      .catch(() => {
        setIsEditing(true);
      })

      .finally(() => {
        isSubmitting.current = false;
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      isEscapped.current = true;
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleRename();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            ref={editInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
