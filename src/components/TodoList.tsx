import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (value: number) => void;
  deletedTodoId: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  deletedTodoId,
  tempTodo,
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
                  onClick={() => removeTodo(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              className={cn('modal overlay ', {
                'is-active': deletedTodoId.includes(id),
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
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
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
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => removeTodo(tempTodo.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            className={cn('modal overlay ', {
              'is-active': tempTodo?.id === 0
              || deletedTodoId.includes(tempTodo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

    </section>
  );
};
