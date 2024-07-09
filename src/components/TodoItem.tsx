import React, { useState } from 'react';
import classNames from 'classnames';
import { TodoItemProps } from '../types/TodoItemProps';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  tempTodo,
  onDelete,
  deletingCompleted = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const showLoader =
    todo.id === tempTodo?.id || isDeleting || deletingCompleted;

  const handleDeleteClick = (todoId: number) => {
    setIsDeleting(true);
    onDelete(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteClick(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
