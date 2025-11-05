import React from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  deleteLoading: boolean;
  deleteTodoIds: number[];
  loader: boolean;
  tempTodo: Todo | null;
  onDelete: (todoId: Todo['id']) => void;
};

export const TodoMain: React.FC<Props> = ({
  visibleTodos,
  deleteTodoIds,
  loader,
  // deleteLoading,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!loader &&
        visibleTodos.map(todo => {
          return (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                {todo.completed ? (
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                ) : (
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                )}
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
                  onDelete(todo.id);
                }}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={cn('modal', 'overlay', {
                  'is-active': deleteTodoIds.includes(todo.id),
                })}
              >
                {/* eslint-disable-next-line max-len */}
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="tempTodo" className="todo__status-label">
            <input
              id="tempTodo"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
