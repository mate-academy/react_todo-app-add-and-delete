import React, { useState } from 'react';
import cn from 'classnames';

import './Todo.scss';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  onDelete: (todoId: number) => Promise<void>;
  ids: number[];
};

export const Todo: React.FC<Props> = ({ todo, onDelete, ids }) => {
  const [completed, setCompleted] = useState(todo.completed);
  const [loading, setLoading] = useState(false);

  const handleCompleted = () => setCompleted(!completed);

  const deleteTodo = () => {
    setLoading(true);

    onDelete(todo.id)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleCompleted}
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
        onClick={deleteTodo}
        disabled={loading || ids.includes(todo.id)}
      >
        ×
      </button>

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': loading || ids.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  // {/* This todo is being edited */}
  // <div className="todo">
  //   <label className="todo__status-label">
  //     <input
  //       type="checkbox"
  //       className="todo__status"
  //     />
  //   </label>

  //   {/* This form is shown instead of the title and remove button */}
  //   <form>
  //     <input
  //       type="text"
  //       className="todo__title-field"
  //       placeholder="Empty todo will be deleted"
  //       // value="Todo is being edited now"
  //     />
  //   </form>

  //   <div className="modal overlay">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>
  );
};
