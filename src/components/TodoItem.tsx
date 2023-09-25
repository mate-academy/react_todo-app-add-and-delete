import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete: (value: number) => void,
  onTodoUpdate: (todo: Todo, title: string) => void,
  onToggleChange: (todo: Todo) => void,
  isLoading: number[],
  handleLoading: (value: number[]) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete,
  onTodoUpdate,
  onToggleChange,
  isLoading,
  handleLoading,
}) => {
  const { completed, title, id } = todo;
  // const [completedStatus, setCompletedStatus] = useState(completed);
  const [isEdiding, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleLoading([todo.id]);

    if (todoTitle) {
      await onTodoUpdate(todo, todoTitle);
    } else {
      await onTodoDelete(todo.id);
    }

    setIsEditing(false);
    handleLoading([]);
  };

  const handleTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const handleToggleChange = () => {
    onToggleChange(todo);
    // setCompletedStatus(!completed);
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdiding && titleInput.current) {
      titleInput.current?.focus();
    }
  }, [isEdiding]);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed },
        )}
      >

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleToggleChange}
          />
        </label>

        {isEdiding
          ? (
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
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>
          )}

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => (onTodoDelete(id))}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal',
            'overlay',
            { 'is-active': (isLoading.includes(todo.id) || id === 0) },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

      </div>
    </>
  );
};
