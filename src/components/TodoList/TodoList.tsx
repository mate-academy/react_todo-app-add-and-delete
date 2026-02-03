/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface PropsTodoList {
  todos: Todo[];
  isEdited: number;
  onEdited: (value: number) => void;
  loadingIds: number[];
  isCreating: boolean;
  onDelete: (todo: Todo) => void;
  tempTitle: string;
}

export const TodoList: React.FC<PropsTodoList> = ({
  todos,
  isEdited,
  onEdited,
  loadingIds,
  isCreating,
  onDelete,
  tempTitle,
}) => {
  const handleSubmit = (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();

    onEdited(0);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos &&
        todos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            {isEdited === todo.id ? (
              <form onSubmit={handleSubmit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={todo.title}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => onEdited(todo.id)}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': loadingIds?.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

      {isCreating && (
        <div data-cy="Todo" className="todo" key="temp-todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTitle}
          </span>

          <button type="button" className="todo__remove">
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
