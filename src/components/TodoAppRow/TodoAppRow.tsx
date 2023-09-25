import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete: (todoId: number) => void,
  onTodoUpdate: (todoTitle: string) => void,
  isLoading: boolean,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo) => void
  onChangeBox: (todoId: number) => void,
};

export const TodoAppRow: React.FC<Props> = ({
  todo,
  onTodoDelete,
  onTodoUpdate,
  selectedTodo,
  setSelectedTodo,
  isLoading,
  onChangeBox,
}) => {
  const {
    title,
    completed,
  } = todo;
  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const titleInput = useRef<HTMLInputElement | null>(null);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await onTodoUpdate(todoTitle);
    } else {
      await onTodoDelete(todo.id);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

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
          onChange={() => onChangeBox(todo.id)}
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
            onDoubleClick={handleTodoDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onTodoDelete(todo.id);
              setSelectedTodo(todo);
            }}

          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading && todo.id === selectedTodo?.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
