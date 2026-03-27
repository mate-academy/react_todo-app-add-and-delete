import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => void;
  handleUpdate: (id: number) => void;
  deletingId: number | null;
  updatingId: number | null;
};

export const TodoList = ({
  todos,
  handleDelete,
  deletingId,
  handleUpdate,
  updatingId,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => {
        const isDeleting = deletingId === todo.id;
        const isUpdating = updatingId === todo.id;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              {/* eslint-disable jsx-a11y/label-has-associated-control*/}
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  handleUpdate(todo.id);
                }}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleDelete(todo.id);
              }}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isDeleting || isUpdating,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
