import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleComplete: (id: number, completed: boolean) => void,
  handleDelete: (id: number) => void,
  isUpdatingId: number[],
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleComplete,
  handleDelete,
  isUpdatingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        return (
          <div
            id={`${id}`}
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed })}
          >
            <label className="todo__status-label">
              <input
                id={`${id}`}
                key={id}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                readOnly
                onClick={() => {
                  handleComplete(id, completed);
                }}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              id={`${id}`}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleDelete(id);
              }}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal',
                'overlay',
                { 'is-active': isUpdatingId.some(ids => ids === id) },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
});
