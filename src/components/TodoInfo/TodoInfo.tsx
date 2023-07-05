import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deletingTodo: number[];
  removeTodo: (todoId: number) => void;

};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  deletingTodo,
}) => {
  const { id, completed, title } = todo;
  const isDeletingTodo = deletingTodo.includes(id);

  return (
    <div
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          // checked={completed}
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay',
        { 'is-active': isDeletingTodo })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};

/*
  // This todo is not completed
  <div className="todo">
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span className="todo__title">Not Completed Todo</span>
    <button type="button" className="todo__remove">×</button>

    <div className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>

  // This todo is being edited
  <div className="todo">
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
      />
    </label>

    // This form is shown instead of the title and remove button
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

  // This todo is in loadind state
  <div className="todo">
    <label className="todo__status-label">
      <input type="checkbox" className="todo__status" />
    </label>

    <span className="todo__title">Todo is being saved now</span>
    <button type="button" className="todo__remove">×</button>

    // 'is-active' class puts this modal on top of the todo
    <div className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
*/
