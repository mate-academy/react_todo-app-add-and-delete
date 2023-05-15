import React from 'react';
import clasnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
};

export const TodoComponent:React.FC<Props> = ({
  todo,
  loadingTodoId,
  onDelete,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  return (
    <div
      className={clasnames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={clasnames('modal overlay', {
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

/* This todo is being edited
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      This form is shown instead of the title and remove button
      <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

    This todo is in loadind state
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">Todo is being saved now</span>
      <button type="button" className="todo__remove">×</button>

      'is-active' class puts this modal on top of the todo
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */
