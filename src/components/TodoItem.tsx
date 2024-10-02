import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  deletingTodoId: number | null;
  onDeleteTodo: (id: number) => void;
  isAddingTodo?: boolean;
  onUpdateStatus: (id: number, completed: boolean) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deletingTodoId,
  onDeleteTodo,
  isAddingTodo,
  onUpdateStatus,
}) => {
  const { id, title, completed } = todo;
  const isDeleting = id === deletingTodoId;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdateStatus(id, !completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isAddingTodo
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
