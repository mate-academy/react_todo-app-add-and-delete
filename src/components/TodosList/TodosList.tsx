import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
}

export const TodosList: React.FC<Props> = ({
  todos,
}) => {
  const [isEditing] = useState(false);

  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const {
          title,
          completed,
          id,
        } = todo;

        return (
          <div
            className={cn('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={completed}
              />
            </label>

            {isEditing ? (
              <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue="Todo is being edited now"
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                >
                  ×
                </button>
              </>
            )}

            {/* 'is-active' class puts this modal on top of the todo */}
            <div
              className={cn('modal overlay', {
                'is-active': !(todos.length), // will change in future. When todo is loading
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
