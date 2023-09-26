import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete?: (todoId: number) => void,
  onTodoUpdate?: (todo: Todo, newTodoTitle: string) => void
  isProcessing: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete = () => {},
  onTodoUpdate = () => {},
  isProcessing,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await onTodoUpdate(todo, todoTitle);
    } else {
      await onTodoDelete(todo.id);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      key={todo.id}
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed, 'item-enter-done': true })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
            placeholder="Empty todo will be delecyed"
            value={todoTitle}
            onChange={handleTodoTitleChange}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={handleTodoDoubleClick}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay',
                { 'is-active': isProcessing })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </span>

          <button
            onClick={() => {
              onTodoDelete(todo.id);
            }}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

    </div>
  );
};
