import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onRemove: (todoID: number) => void,
  todos: Todo[],
  onDeleted: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onDeleted,
}) => {
  const [deleting, setDeleting] = useState<number | null>(null);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <React.Fragment key={todo.id}>
          <div
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >
            <label
              className="todo__status-label"
            >
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>
              <span
                className="todo__title"
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  onRemove(todo.id);
                  setDeleting(todo.id)
                }}
              >
                ×
              </button>

              {onDeleted && (
              <div
                className={classNames(
                  'modal overlay',
                  { 'is-active': todo.id === deleting}
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
              )}
          </div>
        </React.Fragment>
      ))}
    </section>
  );
};
