/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { useState } from 'react';
import { TodoData } from '../types/TodoData';

interface TodoFieldProps {
  todo: TodoData,
  isTempTodo: boolean,
  onTodoDelete: (todoId: number) => Promise<void>;
}

export const Todo = ({ onTodoDelete, isTempTodo, todo }: TodoFieldProps) => {
  const { completed, title, id } = todo;
  const [editTodo, setEditTodo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <div className={classNames('todo', { completed })}>
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" checked />
        </label>
        {editTodo ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <span
            className="todo__title"
            onClick={() => setEditTodo(true)}
          >
            {title}

          </span>
        )}
        <div className={classNames('modal overlay', {
          'is-active': isTempTodo || isDeleting,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            setIsDeleting(true);
            onTodoDelete(id).finally(() => setIsDeleting(false));
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};
