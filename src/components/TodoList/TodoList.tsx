import classNames from 'classnames';
import React from 'react';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  onDelete: (todoId: number) => Promise<void>,
  activeTodoId: number[],
}

export const Todolist: React.FC<Props> = React.memo((
  { todos, onDelete, activeTodoId },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => (
                onDelete(id)
              )}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay',
                { 'is-active': activeTodoId.includes(id) })}
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
