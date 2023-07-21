import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  preparedTodos: Todo[],
  onDelete: (id: number) => void;
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  onDelete = () => { },
  tempTodo,
}) => {
  return (
    <>
      {preparedTodos?.map(({ id, completed, title }) => {
        return (
          <div
            className={classNames('todo', {
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

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>

            {tempTodo && (
              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
