import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete: (todoId: number) => void;
  onTodoUpdate: (todoTitle: string) => void;
};

export const Main: React.FC<Props> = ({ todo, onTodoDelete, onTodoUpdate }) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleDubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await onTodoUpdate(todoTitle);
    } else {
      await onTodoDelete(id);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>
        </>

      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
