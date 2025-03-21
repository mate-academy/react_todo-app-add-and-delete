import { Todo } from '../../types/Todo';
import cls from 'classnames';
import React from 'react';
import { TodoLoader } from '../TodoLoader/TodoLoader';

export interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  deleteTodo?: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  deleteTodo,
}) => {
  return (
    <div data-cy="Todo" className={cls('todo', { completed: todo.completed })}>
      {isLoading && <TodoLoader />}

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
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
        onClick={() => deleteTodo?.(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
