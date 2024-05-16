/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useState } from 'react';
import { TodoProps } from './todo.props';

export const TodoComponent: React.FC<TodoProps> = ({
  todo,
  isTemp = false,
}) => {
  const [isEditionActive, setIsEditionActive] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleEditForm = () => {
    setIsEditionActive(value => !value);
  };

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={todo.completed ? 'todo completed' : 'todo'}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>
        {isEditionActive ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onBlur={handleEditForm}
              onChange={handleTitle}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleEditForm}
            >
              {title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>
          </>
        )}

        {isTemp && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};

export default TodoComponent;
