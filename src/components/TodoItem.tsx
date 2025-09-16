/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  loadingTodoId: number[];
  onDelete?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  loadingTodoId,
  onDelete,
}) => {
  const [editTodoId, setEditTodoId] = useState<number | null>();
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleEdit = (todoId: number) => {
    setEditTodoId(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          autoFocus
        />
      </label>

      {todo.id === editTodoId ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => setEditTodoId(null)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEdit(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              if (onDelete) {
                onDelete(todo.id);
              }
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading && loadingTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
