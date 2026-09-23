/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  deletingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  updatingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  deletingIds,
  onDelete,
  onUpdate,
  updatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isDeleting = deletingIds.includes(todo.id);
        const isUpdating = updatingIds.includes(todo.id);

        return (
          <div
            key={todo.id}
            className={classNames('todo', {
              completed: todo.completed,
            })}
            data-cy="Todo"
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() =>
                  onUpdate(todo.id, { completed: !todo.completed })
                }
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
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
            {/* overlay will cover the todo while it is being deleted or updated */}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoading || isDeleting || isUpdating,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div
          key={tempTodo.id}
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
          data-cy="Todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
