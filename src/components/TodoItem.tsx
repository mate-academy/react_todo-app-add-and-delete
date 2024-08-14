/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  editTodo: number;
  deleteTodo: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  field: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  editTodo,
  deleteTodo,
  onEdit,
  onDelete,
  field,
}) => (
  <div data-cy="Todo" className={classNames('todo', { completed: completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
      />
    </label>

    {editTodo === id ? (
      <form>
        <input
          ref={field}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={title}
          onBlur={() => onEdit(0)}
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEdit(id)}
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': deleteTodo === id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </>
    )}
  </div>
);
