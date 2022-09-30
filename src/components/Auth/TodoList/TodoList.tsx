import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../../types/Todo';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        todos.map(({ title, completed, id }) => {
          return (
            <div
              data-cy="Todo"
              className={classNames(
                'todo',
                {
                  completed,
                },
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
                onClick={() => {
                  removeTodo(id);
                }}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal overlay',
                  { 'is-active': selectedId.includes(id) },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader is-loading " />
              </div>
            </div>
          );
        })
      }
    </section>
  );
};
