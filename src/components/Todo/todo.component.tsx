/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useCallback, useState } from 'react';
import { TodoProps } from './todo.props';
import { deleteTodo } from '../../api/todos';
import { ErrorTypes } from '../Errors/error';
import * as Services from '../../api/todos';

export const TodoComponent: React.FC<TodoProps> = ({
  todo,
  isTemp = false,
  onDeleteTodo,
  onError,
  onTodoChange,
}) => {
  const [isEditionActive, setIsEditionActive] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(isTemp);

  const handleEditForm = () => {
    setIsEditionActive(value => !value);
  };

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCheckboxChange = useCallback(() => {
    const newCheckedState = !todo.completed;

    setIsLoading(true);
    Services.updateTodo(todo.id, { completed: newCheckedState })
      .then(() => {
        onTodoChange({ id: todo.id, completed: newCheckedState });
      })
      .catch(() => {
        onError(ErrorTypes.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [onError, todo, onTodoChange]);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => {
        onDeleteTodo && onDeleteTodo(todo.id);
      })
      .catch(() => {
        const errorMessage = ErrorTypes.UnableToDeleteTodo;

        onError && onError(errorMessage);
      })
      .finally(() => {
        setIsLoading(true);
      });
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
            onChange={handleCheckboxChange}
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

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
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
    </>
  );
};

export default TodoComponent;
