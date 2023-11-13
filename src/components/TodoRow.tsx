import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete?: () => void,
  onTodoRename?: (todoTitle: string) => void,
  onTodoToggle?: () => void,
  isProcessing?: boolean,
};

export const TodoRow: React.FC<Props> = ({
  todo,
  onTodoDelete = () => { },
  onTodoRename = () => { },
  onTodoToggle = () => { },
  isProcessing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);
  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleTodoSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizesTodoTitle = todoTitle.trim();

    if (normalizesTodoTitle) {
      if (normalizesTodoTitle !== todo.title) {
        onTodoRename(normalizesTodoTitle);
      }
    } else {
      onTodoDelete();
    }

    setIsEditing(false);
  };

  const handleEscPressed = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.keyCode === 27) {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={onTodoToggle}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInput}
            onKeyUp={handleEscPressed}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={onTitleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onTodoDelete}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
