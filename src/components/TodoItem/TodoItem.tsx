import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
}) => {
  const [loading, setLoading] = useState(isLoading);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setLoading(true);
          onDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          cn('modal overlay', { 'is-active': loading })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
