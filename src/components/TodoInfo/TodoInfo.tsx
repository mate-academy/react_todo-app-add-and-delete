import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoad?: boolean;
}

export const TodoInfo:React.FC<Props> = ({ todo, onDelete, isLoad }) => {

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor='todoStatus' className="todo__status-label">
        <input
          autoFocus
          id="todoStatus"
          aria-label="Some label"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button 
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(todo.id);
          setIsDeleting(true);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoad || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};