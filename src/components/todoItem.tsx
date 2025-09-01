import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  deletingIds?: number[] | null;
  setDeletingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;
};

const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  deletingIds,
  setDeletingIds,
}) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as completed"
          disabled={todo.id === 0}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={todo.id === 0}
        onClick={() => {
          onDelete?.(todo.id);
          setDeletingIds?.(prev => [...prev, todo.id]);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || deletingIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
